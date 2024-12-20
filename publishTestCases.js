import 'dotenv/config'

import { Octokit } from 'octokit';
import { Client } from '@notionhq/client';

const octokit = new Octokit({ auth: process.env.GIT_HUB_TOKEN });
const notion = new Client({ auth: process.env.NOTION_API_KEY });

// const parentIssueNumber = 4;
// const parentIssueNodeId = getNodeIdFromIssueNumber(parentIssueNumber);

// function to get all rows from the Notion database
async function getNotionDatabase() {
    const response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE_ID
    });
    return response.results;
}

// function to log the database retrieved from Notion
// async function fetchAndLogNotionDatabase() {
//     const notionData = await getNotionDatabase();
//     console.log(notionData);
// }

// function to get all GitHub projects associated with the repository
async function getGitHubProjects() {
    const query = `
        query($owner: String!, $repo: String!) {
            repository(owner: $owner, name: $repo) {
                projectsV2(first: 10) {
                    nodes {
                        id
                        title
                        url
                    }
                }
            }
        }
    `;

    const response = await octokit.graphql(query, {
        owner: process.env.GIT_HUB_OWNER,
        repo: process.env.GIT_HUB_REPO,
    });

    return response.repository.projectsV2.nodes;
}

// function to return specific project id by title
async function getProjectId(projectTitle) {
    const projects = await getGitHubProjects();
    const projectId = projects.find(project => project.title === projectTitle)?.id;
    return projectId;
}

// function to get all project colums
async function getProjectColumns(projectId) {
    const query = `
        query($projectId: ID!) {
            node(id: $projectId) {
                ... on ProjectV2 {
                    id
                    title
                    url
                    fields(first: 10) {
                        nodes {
                            id
                            name
                        }
                    }
                }
            }
        }
    `;

    const response = await octokit.graphql(query, {
        projectId,
    });

    return response.node.fields.nodes;
}

// function to add issue to the GitHub project
async function addIssueToProject(projectId, issueId) {
    const mutation = `
        mutation($projectId: ID!, $contentId: ID!) {
            addProjectV2ItemById(input: {projectId: $projectId, contentId: $contentId}) {
                item {
                    id
                }
            }
        }
    `;

    const response = await octokit.graphql(mutation, {
        projectId,
        contentId: issueId,
    });

    console.log(`Added issue ID ${issueId} to project ID ${projectId}`);
    return response.addProjectV2ItemById.item.id;
}

// // function to link child issue to parent issue
// async function linkIssues(parentIssueNodeId, childIssueNodeId) {
//     const mutation = `
//         mutation($input: AddIssueRelationInput!) {
//             addIssueRelation(input: $input) {
//                 issueRelation {
//                     id
//                     targetIssue {
//                         id
//                     }
//                     sourceIssue{
//                         id
//                     }
//                 }
//             }
//         }
//     `;

//     const variables = {
//         input: {
//             targetId: parentIssueNodeId,
//             sourceId: childIssueNodeId,
//             relationType: "Related,"
//         },
//     };

//     const response = await octokit.graphql(mutation, variables);
//     console.log(`Linked issue ${childIssueNodeId} to parent issue ${parentIssueNodeId}`);
//     return response.addIssueRelation.issueRelation;
// }

// helper function to convert numeric issue ID to global node ID
async function getNodeIdFromIssueNumber(issueNumber) {
    const query = `
        query($owner: String!, $repo: String!, $issueNumber: Int!) {
            repository(owner: $owner, name: $repo) {
                issue(number: $issueNumber) {
                    id
                }
            }
        }
    `;

    const response = await octokit.graphql(query, {
        owner: process.env.GIT_HUB_OWNER,
        repo: process.env.GIT_HUB_REPO,
        issueNumber,
    });

    return response.repository.issue.id;
}

// function to create or update a GitHub issue
async function syncToGitHub(testCase) {
    const projectId = await getProjectId(process.env.PROJECT_TITLE);
    const title = testCase.description;
    const body = `\n
**Priority**: ${testCase.priority}
**Status**: ${testCase.status}\n
**Preconditions**:\n${testCase.preconditions}\n
**Steps**:\n${testCase.steps}
\n**Expected Result**:\n${testCase.expectedResult}\n
`;

    let issueNumber, issueNodeId;

    if (testCase.githubIssueId) {
        // if issue already exist - update the existing issue
        issueNumber = parseInt(testCase.githubIssueId, 10);
        await octokit.request("PATCH /repos/{owner}/{repo}/issues/{issue_number}", {
            owner: process.env.GIT_HUB_OWNER,
            repo: process.env.GIT_HUB_REPO,
            issue_number: testCase.githubIssueId,
            title,
            body
        });
        console.log(`Updated GitHub Issue #${testCase.githubIssueId}`);
        issueNodeId = await getNodeIdFromIssueNumber(issueNumber);
    } else {
        // if issue does not exist - create new issue
        const response = await octokit.request("POST /repos/{owner}/{repo}/issues", {
            owner: process.env.GIT_HUB_OWNER,
            repo: process.env.GIT_HUB_REPO,
            title,
            body,
            labels: ['test-case']
        });
        // return the GitHub issue ID
        issueNumber = response.data.number
        console.log(`Created GitHub Issue #${issueNumber}`);

        // convert the issue number to GraphQL global node ID
        issueNodeId = await getNodeIdFromIssueNumber(issueNumber);
    }

    // add the issue to the GitHub project
    if (projectId) {
        const addedItemId = await addIssueToProject(projectId, issueNodeId);
        console.log(`Added isse #${issueNodeId} to project with item ID ${addedItemId}`);
    }

    return issueNumber;
}

// funtion to sync all test cases to GitHub
async function syncTestCases() {

    // get the test cases data created in Notion
    const notionData = await getNotionDatabase();

    for (const row of notionData) {
        const properties = row.properties;

        // extract test case properties from each Notion database row
        const testCase = {
            description: properties['Description']?.rich_text[0]?.plain_text || 'Untitled Test Case',
            priority: properties['Priority']?.select?.name || '',
            status: properties['Status']?.status?.name || '',
            preconditions: properties['Preconditions']?.rich_text[0]?.plain_text || '',
            steps: properties['Steps']?.rich_text[0]?.plain_text || '',
            expectedResult: properties['Expected Result']?.rich_text[0]?.plain_text || '',
            githubIssueId: properties['GitHub Issue']?.rich_text[0]?.plain_text || null,
        };

        // sync the test case to GitHub
        const gitHubIssueId = await syncToGitHub(testCase);
        // const childIssueNodeId = await getNodeIdFromIssueNumber(gitHubIssueId);

        // link the newly created issue to the parent issue
        // if (parentIssueNodeId && childIssueNodeId) {
        //     await linkIssues(parentIssueNodeId, childIssueNodeId);
        // }

        // Update Notion with the GitHub Issue Id if there is a new issue created
        if (!testCase.githubIssueId && gitHubIssueId) {
            await notion.pages.update({
                page_id: row.id,
                properties: {
                    'GitHub Issue': {
                        rich_text: [
                            {
                                text: {
                                    content: String(gitHubIssueId),
                                },
                            },
                        ],
                    },
                },
            });
            console.log(`Notion row is updated with GitHub Issue ID #${gitHubIssueId}`);
        };
    }
}

// Run the script
syncTestCases().catch((err) => console.error(err));
