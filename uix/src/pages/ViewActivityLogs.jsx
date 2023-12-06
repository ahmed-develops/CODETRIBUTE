import React, { useEffect, useState } from "react";
import { Table } from 'react-bootstrap';
import "../assets/ViewProjects.css";
import { NavLink } from "react-router-dom";

const ViewActivityLogs = ({ loginCredentials }) => {
    const [systemLogs, setSystemLogs] = useState([]);

    useEffect(() => {
        const loadActivityLogs = async () => {
            try {
                if (!loginCredentials || !loginCredentials.user_id) {
                    console.error('Login credentials are missing');
                    return;
                }

                const systemLogsApi = await fetch(`http://localhost:3300/view/activity/logs/${loginCredentials.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const logsApiRes = await systemLogsApi.json();

                if (logsApiRes.status === 200) {
                    setSystemLogs(Array.isArray(logsApiRes) ? logsApiRes : [logsApiRes]);
                }
            } catch (error) {
                console.error('Error fetching system logs:', error);
            }
        };

        loadActivityLogs();
    }, [loginCredentials]);

    return (
        <>
        <center>
          <NavLink to={`/${loginCredentials.privilege}-portal`} className="btn btn-primary">
            Go Back
          </NavLink>
        <br/>

        </center>
        <hr/>
        <b>TRANSACTIONAL LOGS</b>
        <hr/>
            {systemLogs.length !== 0 ? (
                <Table striped bordered hover responsive className="custom-table">
                    <thead>
                        <tr>
                            <th>Log ID</th>
                            <th>Timestamp</th>
                            <th>Actor ID</th>
                            <th>Operation Type</th>
                            <th>Table Name</th>
                            <th>Query</th>
                        </tr>
                    </thead>
                    <tbody>
                        {systemLogs.map((log, index) => (
                            <tr key={index}>
                                <td>{log.log_id}</td>
                                <td>{log.timestamp}</td>
                                <td>{log.user_id}</td>
                                <td>{log.operation_type}</td>
                                <td>{log.table_name}</td>
                                <td>{log.query}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>No system logs available</p>
            )}
        </>
    );
};

export default ViewActivityLogs;
