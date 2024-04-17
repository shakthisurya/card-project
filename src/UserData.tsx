import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircularProgress, Grid, Card, CardContent, CardActions, Button, Typography } from '@mui/material';

const UserData: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const savedData = localStorage.getItem('userData');
        if (savedData) {
          setUserData(JSON.parse(savedData));
          setLoading(false);
        } else {
          const response = await axios.get('https://randomuser.me/api/?results=50');
          const userData = response.data.results;
          localStorage.setItem('userData', JSON.stringify(userData));
          setUserData(userData);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://randomuser.me/api/?results=50');
      const userData = response.data.results;
      localStorage.setItem('userData', JSON.stringify(userData));
      setUserData(userData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index: number) => {
    const updatedData = userData.filter((_, i) => i !== index);
    setUserData(updatedData);
    localStorage.setItem('userData', JSON.stringify(updatedData));
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <CircularProgress
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      <Button variant="contained" color="primary" onClick={handleRefresh} style={{ marginBottom: 16 }}>
        Refresh
      </Button>
      <Typography variant="h6">Total users: {userData.length}</Typography>
      <Grid container spacing={3}>
        {userData.map((user: any, index: number) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <img src={user.picture.large} alt="Profile" />
                <Typography variant="h5">{`${user.name.first} ${user.name.last}`}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="secondary" onClick={() => handleDelete(index)}>Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default UserData;
