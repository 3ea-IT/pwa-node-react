import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Paper, Typography, Button, IconButton, CircularProgress } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, DirectionsWalk } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './FitnessData.css';

const FitnessData = () => {
    const navigate = useNavigate();
    const [fitData, setFitData] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchFitData(currentDate);
    }, [currentDate]);

    const handleGoogleFitAuth = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };     

    const fetchFitData = (date) => {
        setIsLoading(true);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
    
        const startTimeNs = startOfDay.getTime() * 1000000;
        const endTimeNs = endOfDay.getTime() * 1000000;
    
        axios.get('/api/fetch-fit-data', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            params: {
                startTimeNs: startTimeNs.toString(),
                endTimeNs: endTimeNs.toString()
            }
        })
        .then(response => {
            console.log('Received data:', response.data);
            setFitData(prevData => ({
                ...prevData,
                [date.toDateString()]: response.data
            }));
            setIsConnected(true);
            setIsLoading(false);
        })
        .catch(error => {
            console.error('Error fetching Google Fit data:', error);
            setIsLoading(false);
        });
    };

    const getTotalSteps = () => {
        const dayData = fitData[currentDate.toDateString()];
        if (!dayData || !dayData.point) return 0;
        return dayData.point.reduce((total, point) => total + point.value[0].intVal, 0);
    };

    const getChartData = () => {
        const dayData = fitData[currentDate.toDateString()];
        if (!dayData || !dayData.point) return [];
        return dayData.point.map(point => ({
            time: new Date(parseInt(point.startTimeNanos) / 1000000).toLocaleTimeString(),
            steps: point.value[0].intVal
        }));
    };

    const handleDateChange = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + (direction === 'forward' ? 1 : -1));
        setCurrentDate(newDate);
    };

    if (!isConnected) {
        return (
            <Container className="fitness-container">
                <Paper className="fitness-paper">
                    <Typography variant="h4" gutterBottom>Fitness Data</Typography>
                    <div className="connect-button-container">
                        <Button variant="contained" color="primary" onClick={handleGoogleFitAuth}>
                            Connect to Google Fit
                        </Button>
                    </div>
                </Paper>
            </Container>
        );
    }

    return (
        <Container className="fitness-container">
            <Paper className="fitness-paper">
                <div className="date-navigation">
                    <IconButton onClick={() => handleDateChange('back')}>
                        <ArrowBackIos />
                    </IconButton>
                    <Typography variant="h6">
                        {currentDate.toDateString()}
                    </Typography>
                    <IconButton onClick={() => handleDateChange('forward')}>
                        <ArrowForwardIos />
                    </IconButton>
                </div>
                {isLoading ? (
                    <CircularProgress />
                ) : (
                    <>
                        <div className="step-count">
                            <DirectionsWalk fontSize="large" />
                            <Typography variant="h4">
                                {getTotalSteps()} steps
                            </Typography>
                        </div>
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={getChartData()}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="time" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="steps" stroke="#8884d8" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default FitnessData;