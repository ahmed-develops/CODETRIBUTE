import React, { useEffect, useState } from "react";
import { Table } from 'react-bootstrap';
import "../../assets/ViewProjects.css";

const ViewSystemLogs = ({ loginCredentials }) => {
    const [systemLogs, setSystemLogs] = useState([]);

    useEffect(() => {
        const loadSystemLogs = async () => {
            try {
                if (!loginCredentials || !loginCredentials.user_id) {
                    console.error('Login credentials are missing');
                    return;
                }

                const systemLogsApi = await fetch(`http://localhost:3300/view/system/logs/${loginCredentials.user_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const logsApiRes = await systemLogsApi.json();

                if (logsApiRes.status === 400 || logsApiRes.status === 500) {
                    alert(`API Responded:\n ${logsApiRes.msg}`);
                } else {
                    setSystemLogs(Array.isArray(logsApiRes) ? logsApiRes : [logsApiRes]);
                }
            } catch (error) {
                console.error('Error fetching system logs:', error);
            }
        };

        loadSystemLogs();
    }, [loginCredentials]);

    return (
        <>
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

export default ViewSystemLogs;
