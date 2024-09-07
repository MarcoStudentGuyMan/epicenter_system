import React, { useState, useEffect } from 'react';
import { IonIcon, IonApp } from '@ionic/react'; 
import { useNavigate } from 'react-router-dom';
import { easel, notifications, personCircle, cube, storefront, people, triangle, prism, mail, chatbubble, newspaper, calculator, exit } from 'ionicons/icons';
import '../styles/epicentersite_A.css';
import MiniDrawer from './drawer_admin';

function DashboardA() {
    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [homeData, setHomeData] = useState(null);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        image6: null,
    });

    useEffect(() => {
        // Fetch the current home data from Strapi
        fetch('http://localhost:1338/api/homes?populate=*')
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
    }, []);

    const handleImageChange = (e, imageKey) => {
        const file = e.target.files[0];
        setImages(prevState => ({ ...prevState, [imageKey]: file }));
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Create a FormData object for sending images
        const formData = new FormData();
        formData.append('data', JSON.stringify({ Description: description }));
    
        const uploadedImageIDs = {};
    
        // Step 1: Upload images if any are selected
        for (const key in images) {
            if (images[key] instanceof File) {
                const imageFormData = new FormData();
                imageFormData.append('files', images[key]);
    
                try {
                    const uploadResponse = await fetch('http://localhost:1338/api/upload', {
                        method: 'POST',
                        body: imageFormData,
                    });
                    const uploadData = await uploadResponse.json();
    
                    // Ensure the image is uploaded successfully and has an ID
                    if (uploadData && uploadData[0] && uploadData[0].id) {
                        uploadedImageIDs[key] = uploadData[0].id; // Save the image ID
                    } else {
                        console.error(`Failed to upload ${key}. Response: `, uploadData);
                    }
                } catch (error) {
                    console.error(`Failed to upload ${key}`, error);
                }
            }
        }
    
        // Step 2: Prepare the data object with the uploaded image IDs
        const updatedData = {
            Description: description,
            Image1: uploadedImageIDs.image1 || homeData.Image1?.id, // Keep existing image if not updated
            Image2: uploadedImageIDs.image2 || homeData.Image2?.id,
            Image3: uploadedImageIDs.image3 || homeData.Image3?.id,
            Image4: uploadedImageIDs.image4 || homeData.Image4?.id,
            Image5: uploadedImageIDs.image5 || homeData.Image5?.id,
            Image6: uploadedImageIDs.image6 || homeData.Image6?.id,
        };
    
        try {
            // Step 3: Send the updated data with the image IDs to Strapi
            const response = await fetch('http://localhost:1338/api/homes/1', { // Adjust the ID as necessary
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
        }
    };
    
    

    const handleDrawerToggle = (isOpen) => {
        setDrawerOpen(isOpen);
    };

    return (
        <IonApp>
            <div className="app-container"> {/* Keep this for header and sidebar */}
                <MiniDrawer onDrawerToggle={handleDrawerToggle} />
                <header
                    className="tenantSide-header"
                    style={{
                        marginLeft: drawerOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <div className="header-left">
                        <a onClick={() => navigate('/dashboard_admin')}>
                            <img className="logo-nav" src={`${process.env.PUBLIC_URL}/EPICENTER_logo.png`} alt="Epicenter Logo" />
                        </a>
                        <span className="app-name">Epicenter</span>
                    </div>
                    <div className="header-right">
                        <a onClick={() => navigate('/email_admin')}>
                            <IonIcon icon={mail} className="icon" />
                        </a>
                        <IonIcon icon={notifications} className="icon" />
                    </div>
                </header>
                <main
                    className="tenantSide-main-content"
                    style={{
                        marginLeft: drawerOpen ? 240 : 60,
                        transition: 'margin-left 0.3s',
                    }}
                >
                    <div className="edit-page-container"> {/* New outer container for centering the content */}
                        <div className="transparent-box">
                            <h1>Edit Home Page</h1>
                            {homeData ? (
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <label>Description</label>
                                        <textarea
                                            value={description}
                                            onChange={handleDescriptionChange}
                                            rows={5}
                                            style={{ width: '100%', padding: '10px', borderRadius: '8px' }}
                                        />
                                    </div>
    
                                    {/* Image Upload Section */}
                                    {Object.keys(images).map((imageKey) => (
                                        <div key={imageKey}>
                                            <label>{`Image ${imageKey.replace('image', '')}`}</label>
                                            <input type="file" onChange={(e) => handleImageChange(e, imageKey)} />
                                            {images[imageKey] && (
                                                <img
                                                    src={`http://localhost:1338${images[imageKey]}`}
                                                    alt={`Image ${imageKey.replace('image', '')}`}
                                                    width="100"
                                                />
                                            )}
                                        </div>
                                    ))}
    
                                    <button type="submit" className="submit-btn">Save Changes</button>
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

export default DashboardA;
