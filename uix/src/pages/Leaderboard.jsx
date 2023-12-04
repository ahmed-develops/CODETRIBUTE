import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Table } from "react-bootstrap";

const Leaderboard = ({ loginCredentials }) => {
  const [commitCount, setCommitCount] = useState(0);
  const [contributors, setContributors] = useState([]);

  useEffect(() => {
    const fetchAllContributors = async () => {
      try {
        const response = await fetch('http://localhost:3300/get/contributors');
        const data = await response.json();
        setContributors(data);
      } catch (error) {
        console.error("Error fetching contributors:", error);
      }
    };

    fetchAllContributors();
  }, []);

  const fetchCommitCount = async (contributorId) => {
    try {
      const response = await fetch(`http://localhost:3300/get/commit/count/leaderboard/${contributorId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching commit count:", error);
      return 0;
    }
  };

  useEffect(() => {
    const fetchCommitCountForLoggedInUser = async () => {
      try {
        const data = await fetchCommitCount(loginCredentials.user_id);
        setCommitCount(data);
      } catch (error) {
        console.error("Error fetching commit count for logged-in user:", error);
      }
    };

    if (loginCredentials.user_id) {
      fetchCommitCountForLoggedInUser();
    }
  }, [loginCredentials.user_id]);

  useEffect(() => {
    const fetchCommitCountsForAllContributors = async () => {
      try {
        const contributorsWithCommitCounts = await Promise.all(
          contributors.map(async (contributor) => {
            try {
              const commitCount = await fetchCommitCount(contributor.user_id);
              return { ...contributor, commitCount };
            } catch (error) {
              console.error("Error fetching commit count for contributor:", error);
              return { ...contributor, commitCount: 0 };
            }
          })
        );

        const sortedContributors = [...contributorsWithCommitCounts].sort(
          (a, b) => b.commitCount - a.commitCount
        );

        setContributors(sortedContributors);
      } catch (error) {
        console.error("Error fetching commit counts for all contributors:", error);
      }
    };

    if (contributors.length > 0) {
      fetchCommitCountsForAllContributors();
    }
  }, [contributors, loginCredentials.user_id]); // Include loginCredentials.user_id in the dependency array if needed

  return (
    <>
      <center>
        <NavLink to={`/${loginCredentials.privilege}-portal`} className="btn btn-primary">
          Go Back
        </NavLink>
        <br />
      </center>
      <div>
        <hr />
        LEADERBOARD
        <hr />
        {commitCount !== null ? (
          <Table striped bordered hover responsive className="custom-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Contributor ID</th>
                <th>Contributor Name</th>
                <th># of commits</th>
              </tr>
            </thead>
            <tbody>
              {contributors.map((contributor, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{contributor.user_id}</td>
                  <td>{contributor.name}</td>
                  <td>{contributor.commitCount}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Loading commit count...</p>
        )}
      </div>
    </>
  );
};

export default Leaderboard;
