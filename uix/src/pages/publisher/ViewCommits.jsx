import { useEffect, useState } from "react";
import "../../assets/ViewProjects.css";
import React from "react";

const ViewCommits = ({ loginCredentials }) => {
  const [commitData, setCodeData] = useState([]);

  useEffect(() => {
    const loadCommits = async () => {
      try {
        const res = await fetch(
          `http://localhost:3300/get/commits/projects/${loginCredentials.user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        console.table(data);

        if (Array.isArray(data)) {
          // Merge commit details for the same occurring project IDs
          const mergedCommitData = data.reduce((merged, commit) => {
            const existingProject = merged.find(
              (item) => item.project_id === commit.project_id
            );
            if (existingProject) {
              existingProject.commits.push({
                commit_path: commit.commit_path,
                timestamp: commit.timestamp,
                contributor_id: commit.contributor_id,
              });
            } else {
              merged.push({
                project_id: commit.project_id,
                commits: [
                  {
                    commit_path: commit.commit_path,
                    timestamp: commit.timestamp,
                    contributor_id: commit.contributor_id,
                  },
                ],
              });
            }
            return merged;
          }, []);

          setCodeData(mergedCommitData);
        } else {
          setCodeData([]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadCommits();
  }, [loginCredentials.user_id]);

  return (
    <div className="commits-container">
      <table>
        <thead>
          <tr>
            <th>Project ID</th>
            <th>Commit Details</th>
            <th>Timestamp</th>
            <th>Contributor</th>
          </tr>
        </thead>
        <tbody>
          {commitData.map((project) => (
            <React.Fragment key={project.project_id}>
              <tr>
                <td>{project.project_id}</td>
                <td>
                  {project.commits.map((commit, i) => (
                    <React.Fragment key={i}>
                      <div className="path-cell">{commit.commit_path}</div>
                      {i !== project.commits.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {project.commits.map((commit, i) => (
                    <React.Fragment key={i}>
                      <div>{commit.timestamp}</div>
                      {i !== project.commits.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </td>
                <td>
                  {project.commits.map((commit, i) => (
                    <React.Fragment key={i}>
                      <div>{commit.contributor_id}</div>
                      {i !== project.commits.length - 1 && <hr />}
                    </React.Fragment>
                  ))}
                </td>
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewCommits;
