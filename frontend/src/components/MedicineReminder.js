// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import './MedicineReminder.css';

// const MedicineReminder = () => {
//     const [medicines, setMedicines] = useState([]);
//     const [medicineLogs, setMedicineLogs] = useState([]);
//     const [selectedMedicine, setSelectedMedicine] = useState('');
//     const [dosage, setDosage] = useState('');
//     const [times, setTimes] = useState([]);
//     const [days, setDays] = useState('');
//     const [showForm, setShowForm] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [adherenceRate, setAdherenceRate] = useState(0);
//     const [adherenceData, setAdherenceData] = useState({});

//   // Modify the time input for hours only from 7 AM to 12 AM (midnight)
//   const hourOptions = Array.from({ length: 18 }, (_, i) => {
//     const hour = i + 7;
//     return hour < 10 ? `0${hour}:00` : `${hour}:00`;
//   });

//   useEffect(() => {
//     // Fetch medicines from the backend
//     axios.get('/medicines')
//       .then(response => {
//         if (response.data.length > 0) {
//           setMedicines(response.data);
//         } else {
//           console.warn('No medicines available.');
//         }
//       })
//       .catch(error => {
//         console.error('Error fetching medicines:', error);
//       });

//     // Fetch medicine logs for the user
//     const userId = localStorage.getItem('user_id');
//     axios.get(`/medicine-logs?userId=${userId}`)
//       .then(response => {
//         setMedicineLogs(response.data);
//       })
//       .catch(error => console.error('Error fetching medicine logs:', error));

//     // Calculate adherence rate
//     const calculateAdherenceRate = () => {
//         const totalDoses = medicineLogs.reduce((acc, log) => acc + log.dosage * log.days, 0);
//         const takenDoses = medicineLogs.reduce((acc, log) => acc + (log.taken ? log.dosage * log.days : 0), 0);
//         return (takenDoses / totalDoses) * 100;
//     };

//     setAdherenceRate(calculateAdherenceRate());

//     // Prepare adherence data for chart
//     const adherenceOverTime = medicineLogs.reduce((acc, log) => {
//         const date = new Date(log.created_at).toLocaleDateString();
//         acc[date] = (acc[date] || 0) + (log.taken ? 1 : 0);
//         return acc;
//   }, {});

//   const handleDosageChange = (e) => {
//     setDosage(e.target.value);
//     const numTimes = parseInt(e.target.value);
//     const newTimes = new Array(numTimes).fill('');
//     setTimes(newTimes);
//   };

//   const handleTimeChange = (index, value) => {
//     const updatedTimes = [...times];
//     updatedTimes[index] = value;
//     setTimes(updatedTimes);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Check if selectedMedicine exists in the medicine list
//     let selectedMedicineObj = medicines.find(med => med.med_name === selectedMedicine);

//     // If the medicine is not in the list, add it to the backend
//     if (!selectedMedicineObj) {
//       try {
//         // Insert the new medicine into the medicine table
//         const newMedicineResponse = await axios.post('/medicines', { med_name: selectedMedicine });

//         // Get the inserted medicine ID
//         const newMedicineId = newMedicineResponse.data.id;

//         // Create a medicine object to use in the next step
//         selectedMedicineObj = {
//           id: newMedicineId,
//           med_name: selectedMedicine,
//         };

//         // Add the new medicine to the state
//         setMedicines(prevMedicines => [...prevMedicines, selectedMedicineObj]);

//       } catch (error) {
//         console.error('Error adding new medicine:', error);
//         alert('Error adding new medicine');
//         return;
//       }
//     }

//     // Now insert the medicine log
//     const newMedicineLog = {
//       user_id: localStorage.getItem('user_id'),
//       med_id: selectedMedicineObj.id,
//       dosage: dosage,
//       time_remind: times,
//       days: days,
//       taken: 0,
//     };

//     try {
//       await axios.post('/medicine-logs', newMedicineLog);
//       alert('Medicine log added successfully!');
//       setShowForm(false); // Optionally close the form after submission
//     } catch (error) {
//       console.error('Error adding medicine log:', error);
//     }
//   };

//   const handleTakenChange = (logId, taken) => {
//     axios.patch(`/medicine-logs/${logId}`, { taken }).then(() => {
//       setMedicineLogs(medicineLogs.map(log => log.id === logId ? { ...log, taken } : log));
//     }).catch(error => {
//       console.error('Error updating taken status:', error);
//     });
//   };

//   const getTotalDosageLeft = () => {
//     const activeLogs = medicineLogs.filter(log => log.taken === 0);
//     let totalDosageLeft = 0;
//     activeLogs.forEach(log => {
//       totalDosageLeft += log.dosage * log.days;
//     });
//     return totalDosageLeft;
//   };

//   const handleAllTaken = () => {
//     const allTaken = medicineLogs.every(log => log.taken === 1);
//     if (allTaken) {
//       alert('Congratulations, all your medicines have been taken!');
//       // Update the taken status for all medicine logs
//       Promise.all(medicineLogs.map(log => axios.patch(`/medicine-logs/${log.id}`, { taken: 1 })))
//         .then(() => {
//           setMedicineLogs(medicineLogs.map(log => ({ ...log, taken: 1 })));
//         })
//         .catch(error => {
//           console.error('Error updating taken status:', error);
//         });
//     } else {
//       alert('Please make sure all your medicines have been taken.');
//     }
//   };

//     return (
//         <div className="medicine-reminder-container">
//         <h2>Medicine Reminder Dashboard</h2>

//         <div className="analytics">
//             <div className="analytics-item">
//             <p>Number of Medicines Tracked: {medicineLogs.length}</p>
//             </div>
//             <div className="analytics-item">
//             <p>Total Dosage Left: {getTotalDosageLeft()}</p>
//             </div>
//         </div>

//         <button className="add-medicine-btn" onClick={() => setShowForm(!showForm)}>
//             Add Medicine
//         </button>

//           {showForm && (
//             <form className="medicine-form" onSubmit={handleSubmit}>
//               <label htmlFor="medicine">Medicine Name</label>
//               <input
//                 list="medicine-list"
//                 id="medicine"
//                 name="medicine"
//                 value={selectedMedicine}
//                 onChange={(e) => setSelectedMedicine(e.target.value)}
//                 required
//               />
//               <datalist id="medicine-list">
//                 {medicines.map(medicine => (
//                   <option key={medicine.id} value={medicine.med_name} />
//                 ))}
//               </datalist>

//               <label htmlFor="dosage">Dosage</label>
//               <select id="dosage" value={dosage} onChange={handleDosageChange} required>
//                 <option value="">Select Dosage</option>
//                 <option value="1">OD (Once a Day)</option>
//                 <option value="2">BD (Twice a Day)</option>
//                 <option value="3">TDS (Three Times a Day)</option>
//                 <option value="4">QDS (Four Times a Day)</option>
//               </select>

//               {times.map((time, index) => (
//                 <div key={index} className="time-input">
//                     <label htmlFor={`time-${index}`}>Time {index + 1}</label>
//                     <select
//                     id={`time-${index}`}
//                     value={time}
//                     onChange={(e) => handleTimeChange(index, e.target.value)}
//                     required
//                     >
//                     <option value="">Select Time</option>
//                     {hourOptions.map(hour => (
//                         <option key={hour} value={hour}>{hour}</option>
//                     ))}
//                     </select>
//                 </div>
//                 ))}

//               <label htmlFor="days">Number of Days</label>
//               <input
//                 type="number"
//                 id="days"
//                 value={days}
//                 onChange={(e) => setDays(e.target.value)}
//                 min="1"
//                 required
//               />

//               <button type="submit">Submit</button>
//             </form>
//           )}

//     <div className="medicine-logs">
//         <h3>Tracked Medicines</h3>
//         {medicineLogs.map(log => (
//         <div key={log.id} className="medicine-log">
//             <h3>{log.medicine_name}</h3>
//             <p>Dosage: {log.dosage} times a day</p>
//             <p>Reminders: {Array.isArray(log.time_remind) ? log.time_remind.join(', ') : 'No reminders available'}</p>
//             {Array.from({ length: log.days }).map((_, i) => (
//             <div key={i}>
//                 {Array.isArray(log.time_remind) ? log.time_remind.map((time, index) => (
//                     <p key={index}>
//                         {new Date(2023, 0, i + 1).toLocaleDateString('en-US', { weekday: 'long' })}: {time}
//                         <input
//                             type="checkbox"
//                             checked={log.taken}
//                             onChange={(e) => handleTakenChange(log.id, e.target.checked)}
//                         />
//                     </p>
//                 )) : <p>No reminders available</p>}
//             </div>
//             ))}
//         </div>
//         ))}
//         <button className="all-taken-btn" onClick={handleAllTaken}>
//         Are all your medicines taken?
//         </button>
//     </div>

//         </div>
//       );
//     };

//     export default MedicineReminder;
