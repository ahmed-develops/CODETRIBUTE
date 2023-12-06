import { useEffect, useState } from "react";
import "../../assets/ViewProjects.css";
import React from "react";
import { NavLink } from "react-router-dom";

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
    <>
    <center>
            <NavLink to='/publisher-portal' className='btn btn-primary'>
          Go Back
        </NavLink>
        </center>
    <div className="commits-container">
      {commitData.map((project) => (
        <div key={project.project_id} className="project-table">
          <hr/>
          <h4>{project.project_id}</h4>
          <table>
            <thead>
              <tr>
                <th>Commit Details</th>
                <th>Timestamp</th>
                <th>Contributor</th>
              </tr>
            </thead>
            <tbody>
              {project.commits.map((commit, i) => (
                <tr key={i}>
                  <td className="path-cell">{commit.commit_path}</td>
                  <td>{commit.timestamp}</td>
                  <td>{commit.contributor_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
    </>
  );
  
};

export default ViewCommits;
