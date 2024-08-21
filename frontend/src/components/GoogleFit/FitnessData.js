import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Paper, Typography, Button, IconButton, CircularProgress, Grid } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos, DirectionsWalk, Timer, LocalFireDepartment, Favorite } from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ReferenceArea } from 'recharts';
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
        window.location.href = `${process.env.REACT_APP_API_URL}auth/google`;
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
        if (!dayData || !dayData.steps || !dayData.steps.point) return 0;
    
        // Calculate total steps
        return dayData.steps.point.reduce((total, point) => total + point.value[0].intVal, 0);
    };

    const getTimeSpentWalking = () => {
        const dayData = fitData[currentDate.toDateString()];
        if (!dayData || !dayData.steps || !dayData.steps.point) return 0;
    
        let totalWalkingTime = 0; // in milliseconds
    
        // Iterate over each point in the steps data
        dayData.steps.point.forEach(point => {
            // Calculate the duration for each point (endTimeNanos - startTimeNanos)
            const startTime = parseInt(point.startTimeNanos, 10) / 1000000; // Convert from nanoseconds to milliseconds
            const endTime = parseInt(point.endTimeNanos, 10) / 1000000; // Convert from nanoseconds to milliseconds
    
            // Add the duration to total walking time
            totalWalkingTime += (endTime - startTime);
        });
    
        // Convert total walking time from milliseconds to minutes
        const totalMinutes = Math.floor(totalWalkingTime / (1000 * 60));
    
        return totalMinutes;
    };      

    const getCaloriesBurnt = () => {
        const dayData = fitData[currentDate.toDateString()];
        if (!dayData || !dayData.calories || !dayData.calories.point) return 0;
    
        // Calculate total calories burnt
        let totalCalories = 0;
        dayData.calories.point.forEach(point => {
            totalCalories += point.value[0].fpVal; // Assuming the calories are stored as floating-point values
        });
    
        // Round the total calories to the nearest whole number
        return Math.round(totalCalories);
    };

    const getHeartRateData = () => {
        const dayData = fitData[currentDate.toDateString()];
        if (!dayData || !dayData.heartRate || !dayData.heartRate.point) return [];
    
        return dayData.heartRate.point.map(point => ({
            time: new Date(parseInt(point.startTimeNanos) / 1000000).toLocaleTimeString(),
            bpm: point.value[0].fpVal
        }));
    };
    
    const getLatestHeartRate = () => {
        const heartRateData = getHeartRateData();
        return heartRateData.length > 0 ? Math.round(heartRateData[heartRateData.length - 1].bpm) : 0;
    };
        

    const getChartData = () => {
        const dayData = fitData[currentDate.toDateString()];
        if (!dayData || !dayData.steps || !dayData.steps.point) return [];
    
        // Map over the steps data to create the chart data
        return dayData.steps.point.map(point => ({
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
                    <Typography fontSize={18+"px"} fontWeight={600}>
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
                        <Grid container spacing={1} className="summary-container" alignItems="center">
                            <Grid item xs={6}>
                                <div className="summary-item">
                                    <DirectionsWalk style={{ color: '#4CAF50' }} />
                                    <Typography variant="h5" className="custom-text">{getTotalSteps()} <span>steps</span></Typography>
                                </div>
                                <div className="summary-item">
                                    <Timer style={{ color: '#2196F3' }} />
                                    <Typography variant="h5" className="custom-text">{getTimeSpentWalking()} <span>mins</span></Typography>
                                </div>
                                <div className="summary-item">
                                    <LocalFireDepartment style={{ color: '#FF4081' }} />
                                    <Typography variant="h5" className="custom-text">{getCaloriesBurnt()} <span>kcal</span></Typography>
                                </div>
                            </Grid>
                            <Grid item xs={6}>
                                <div className="pie-chart-container">
                                    <PieChart width={250} height={250}>
                                        {/* Outer ring - Steps */}
                                        <Pie
                                            data={[
                                                { name: 'Steps', value: getTotalSteps() },
                                                { name: 'Remaining', value: 5000 - getTotalSteps() }
                                            ]}
                                            cx={125}
                                            cy={125}
                                            innerRadius={95}
                                            outerRadius={115}
                                            fill="#93c47d"
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            <Cell key="steps-0" fill="#93c47d" />
                                            <Cell key="steps-1" fill="#d9ead3" />
                                        </Pie>

                                        {/* Middle ring - Time spent walking */}
                                        <Pie
                                            data={[
                                                { name: 'Time Spent', value: getTimeSpentWalking() },
                                                { name: 'Remaining', value: 120 - getTimeSpentWalking() }
                                            ]}
                                            cx={125}
                                            cy={125}
                                            innerRadius={70}
                                            outerRadius={90}
                                            fill="#2196F3"
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            <Cell key="time-0" fill="#2196F3" />
                                            <Cell key="time-1" fill="#bfdcf3" />
                                        </Pie>

                                        {/* Inner ring - Calories burned */}
                                        <Pie
                                            data={[
                                                { name: 'Calories Burnt', value: getCaloriesBurnt() },
                                                { name: 'Remaining', value: 100 - getCaloriesBurnt() }
                                            ]}
                                            cx={125}
                                            cy={125}
                                            innerRadius={45}
                                            outerRadius={65}
                                            fill="#FF4081"
                                            paddingAngle={0}
                                            dataKey="value"
                                        >
                                            <Cell key="calories-0" fill="#FF4081" />
                                            <Cell key="calories-1" fill="#ffabc8" />
                                        </Pie>
                                    </PieChart>
                                </div>
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <div className="heart-rate-container">
                                <div className="heart-rate-display">
                                    <Favorite style={{ color: '#FF4081', marginRight: '10px' }} />
                                    <Typography variant="h5" className="custom-text">
                                        {getLatestHeartRate()} <span>bpm</span>
                                    </Typography>
                                </div>
                                <div className="heart-rate-chart">
                                    <ResponsiveContainer width="100%" height={200}>
                                        <LineChart data={getHeartRateData()}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="time" />
                                            <YAxis domain={[0, 180]} />
                                            <Tooltip />
                                            <ReferenceArea y1={50} y2={80} fill="#82ca9d" fillOpacity={0.3} />
                                            <Line type="monotone" dataKey="bpm" stroke="#FF4081" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Grid>

                        <div className="step-count">
                            <DirectionsWalk fontSize='large'/>
                            <Typography fontSize="20px" fontWeight={600} color={'black'}>
                                {getTotalSteps()} <span style={{fontWeight: 500, color: '#808080'}}>steps</span>
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