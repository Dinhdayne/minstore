import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

const Categories = ({ categories, error }) => {
    const sliderRef = useRef(null);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const scroll = (direction) => {
        const cardWidth = sliderRef.current.querySelector(".category-card").offsetWidth;
        const visibleCards = 4;
        for (const categorie of categories) {
            if (categorie.is_active === 0) {
                visibleCards = visibleCards + 1;
            }
        }
        const maxIndex = categories.length - visibleCards;
        let newIndex = index;
        if (direction === "next" && index < maxIndex) newIndex = index + 1;
        else if (direction === "prev" && index > 0) newIndex = index - 1;

        setIndex(newIndex);
        sliderRef.current.style.transform = `translateX(-${newIndex * cardWidth}px)`;
    };

    return (
        <section className="categories">
            <div className="container">
                <div className="categories-header">
                    <h2>Danh mục nổi bật</h2>
                    <div className="arrow">
                        <button onClick={() => scroll("prev")}>&#10094;</button>
                        <button onClick={() => scroll("next")}>&#10095;</button>
                    </div>
                </div>

                {error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="categories-wrapper">
                        <div className="category-grid" ref={sliderRef}>
                            {categories.map((category) => (
                                category.is_active === 1 ? (
                                    <div
                                        key={category.category_id}
                                        className="category-card"
                                        onClick={() => navigate(`/category/${category.category_id}`)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <img src={category.image_url} alt={category.name} />
                                        <div className="overlay">
                                            <h3>{category.name}</h3>
                                        </div>
                                    </div>

                                )
                                    : null
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Categories;
