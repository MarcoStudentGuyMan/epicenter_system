import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import { home, personCircle,prism,triangle, storefront, mail, chatbubble, newspaper, calculator, exit, pencil, people } from 'ionicons/icons';
import { supabase } from '../supabaseConnect';
import '../styles/dashboardT.css';  
import '../styles/dashboardA.css';
import LinearProgress from '@mui/material/LinearProgress';
import styles from '../styles/epicentersiteA.module.css'; 

import MiniDrawer from '../Tenant/drawer_tenant';
import Header from '../Tenant/header_tenant';
import '../styles/HeaderAdmin.css';

import { useDrawer } from '../Admin/drawerContext'; // Use the drawer context



function  MinisiteT({ tenantName }) {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [description, setDescription] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const { isOpen } = useDrawer(); // Use drawer context
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image6: null,
    });
    const [loading, setLoading] = useState(false); // New loading state

    // Use environment variable for the base URL
    const baseUrl = process.env.REACT_APP_STRAPI_URL || 'http://localhost:3001';

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    
    const handleClose = () => {
        setAnchorEl(null);
    };

    const imageLabels = {
        image1: 'Homepage',
        image2: 'Location Background',
        image3: '1st Location',
        image4: '2nd Location',
        image5: 'Join Us Background',
        image6: 'Community Background',
    };

    useEffect(() => {
        fetch(`${baseUrl}/api/homes?populate=*`)
            .then(response => response.json())
            .then(data => {
                const home = data.data[0].attributes;
                setHomeData(home);
                setDescription(home.Description);
                setImages({
                    image1: home.Image1?.data?.[0]?.attributes?.url || null,
                    image2: home.Image2?.data?.[0]?.attributes?.url || null,
                    image3: home.Image3?.data?.[0]?.attributes?.url || null,
                    image4: home.Image4?.data?.[0]?.attributes?.url || null,
                    image5: home.Image5?.data?.[0]?.attributes?.url || null,
                    image6: home.Image6?.data?.[0]?.attributes?.url || null,
                });
            });
    }, [baseUrl]);

    const handleImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        setImages(prevState => ({ ...prevState, [imageKey]: file }));
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);  // Start the loading state when the form is submitted

        const formData = new FormData();
        formData.append('data', JSON.stringify({ Description: description }));

        const uploadedImageIDs = {};
        for (const key in images) {
            if (images[key] instanceof File) {
                const imageFormData = new FormData();
                imageFormData.append('files', images[key]);

                try {
                    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
                        method: 'POST',
                        body: imageFormData,
                    });
                    const uploadData = await uploadResponse.json();
                    if (uploadData && uploadData[0] && uploadData[0].id) {
                        uploadedImageIDs[key] = uploadData[0].id;
                    }
                } catch (error) {
                    console.error(`Failed to upload ${key}`, error);
                }
            }
        }

        const updatedData = {
            Description: description,
            Image1: uploadedImageIDs.image1 || homeData.Image1?.id,
            Image2: uploadedImageIDs.image2 || homeData.Image2?.id,
            Image3: uploadedImageIDs.image3 || homeData.Image3?.id,
            Image4: uploadedImageIDs.image4 || homeData.Image4?.id,
            Image5: uploadedImageIDs.image5 || homeData.Image5?.id,
            Image6: uploadedImageIDs.image6 || homeData.Image6?.id,
        };

        try {
            const response = await fetch(`${baseUrl}/api/homes/1`, {
                method: 'PUT',
                body: JSON.stringify({ data: updatedData }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Data updated successfully');
            } else {
                console.error('Failed to update the data');
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop the loading state when the submission is complete
        }
    };

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    return (
        <IonApp>
            <div className={styles.appContainer}>
                <MiniDrawer onDrawerToggle={handleDrawerToggle} />
                <Header
                    drawerOpen={isOpen}
                    handleDrawerToggle={() => {}}
                    handleClick={handleClick}
                    anchorEl={anchorEl}
                    handleClose={handleClose}
                    navigate={navigate}
                />

                <main
                    className={styles.tenantSideMainContent}
                    style={{
                        marginLeft: isOpen ? 240 : 60, // Adjust main content margin based on drawer state
                        transition: 'margin-left 0.3s',
                      }}
                >
                    <div className={styles.editPageContainer}>
                        <div className={styles.transparentBox}>
                            <h1> My Mini-Site </h1>
                            {loading && <LinearProgress />}  {/* Display progress bar while loading */}
                            {homeData ? (
                                <form onSubmit={handleSubmit}>
                                    <div className={styles.gridContainer}>
                                        <div className={styles.aboutUs}>
                                            <label>About Us</label>
                                            <textarea
                                                value={description}
                                                onChange={handleDescriptionChange}
                                                rows={5}
                                                className={styles.textarea}
                                            />
                                        </div>
                                        <div className={styles.homepageUpload}>
                                            <label>{imageLabels.image1}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, 'image1')} />
                                            {images.image1 && (
                                                <img
                                                    src={`${baseUrl}${images.image1}`}
                                                    alt={imageLabels.image1}
                                                    className={styles.uploadedImage}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.locationUpload}>
                                            <label>{imageLabels.image3}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, 'image3')} />
                                            {images.image3 && (
                                                <img
                                                    src={`${baseUrl}${images.image3}`}
                                                    alt={imageLabels.image3}
                                                    className={styles.uploadedImage}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.locationUpload}>
                                            <label>{imageLabels.image4}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, 'image4')} />
                                            {images.image4 && (
                                                <img
                                                    src={`${baseUrl}${images.image4}`}
                                                    alt={imageLabels.image4}
                                                    className={styles.uploadedImage}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.locationUpload}>
                                            <label>{imageLabels.image2}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, 'image2')} />
                                            {images.image2 && (
                                                <img
                                                    src={`${baseUrl}${images.image2}`}
                                                    alt={imageLabels.image2}
                                                    className={styles.uploadedImage}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.communityUpload}>
                                            <label>{imageLabels.image6}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, 'image6')} />
                                            {images.image6 && (
                                                <img
                                                    src={`${baseUrl}${images.image6}`}
                                                    alt={imageLabels.image6}
                                                    className={styles.uploadedImage}
                                                />
                                            )}
                                        </div>
                                        <div className={styles.joinusUpload}>
                                            <label>{imageLabels.image5}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, 'image5')} />
                                            {images.image5 && (
                                                <img
                                                    src={`${baseUrl}${images.image5}`}
                                                    alt={imageLabels.image5}
                                                    className={styles.uploadedImage}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    <div className={styles.buttonContainer}>
                                        <button className={styles.customGreenButton} type="submit" disabled={loading}>
                                            Save
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </IonApp>
    );
}


export default MinisiteT;
