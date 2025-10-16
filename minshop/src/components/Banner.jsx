import React, { useEffect, useState } from "react";
import "../App.css";

const Banner = () => {
    const [slideIndex, setSlideIndex] = useState(0);
    const slides = [
        { src: "images/1.png", alt: "Banner 1" },
        { src: "images/2.png", alt: "Banner 2" },
        { src: "images/3.png", alt: "Banner 3" },
        { src: "images/4.png", alt: "Banner 4" },
        { src: "images/5.png", alt: "Banner 5" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setSlideIndex(prev => (prev + 1) % slides.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slides.length]);

    const changeSlide = (n) => {
        setSlideIndex(prev => {
            let newIndex = prev + n;
            if (newIndex >= slides.length) return 0;
            if (newIndex < 0) return slides.length - 1;
            return newIndex;
        });
    };

    return (
        <section className="banner">
            <div className="container_banner">
                <div className="banner-slides">
                    {slides.map((slide, index) => (
                        <div key={index} className={`banner-slide ${index === slideIndex ? "active" : ""}`}>
                            <img src={slide.src} alt={slide.alt} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="banner-nav">
                <button onClick={() => changeSlide(-1)}>❮</button>
                <button onClick={() => changeSlide(1)}>❯</button>
            </div>
        </section>
    );
};

export default Banner;
