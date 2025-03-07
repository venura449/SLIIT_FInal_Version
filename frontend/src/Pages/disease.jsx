import React from "react";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

const PlantDiseaseDetection = () => {
    return (
        <>
            <Header />
            <div className="container mx-auto p-6 text-gray-200 flex justify-center">
                <iframe
                    src="https://detect.roboflow.com/?model=plant-disease-detection-v2-2nclk&version=1&api_key=PCjRilQjOkt8Sg4SB7BB"
                    width="100%"
                    height="800px"
                    className="border rounded-lg shadow-lg"
                ></iframe>
            </div>
            <Footer />
        </>
    );
};

export default PlantDiseaseDetection;
