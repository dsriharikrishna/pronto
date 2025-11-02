import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
 
// Import default images
import Slide1 from "../../../assets/image1.jpg";
import Slide2 from "../../../assets/image2.jpg";
import Slide3 from "../../../assets/image3.jpg";
import Slide4 from "../../../assets/image4.jpg";
import Slide5 from "../../../assets/image5.jpg";
import Slide6 from "../../../assets/image6.jpg";
 
const ImageSlider = ({ slides }) => {
  const defaultSlides = [
    {
      image: Slide1,
      alt: "Welcome to our platform",
      caption: "Welcome to Our Platform",
      description: "Start your journey with us today",
    },
    {
      image: Slide2,
      alt: "Secure access",
      caption: "Secure Access",
      description: "Your data is protected with industry-standard security",
    },
    {
      image: Slide3,
      alt: "Easy to use",
      caption: "Intuitive Interface",
      description: "Designed for seamless user experience",
    },
    {
      image: Slide4,
      alt: "24/7 Support",
      caption: "Always Available",
      description: "Our support team is ready to help you anytime",
    },
    {
      image: Slide5,
      alt: "Easy to use",
      caption: "Intuitive Interface",
      description: "Designed for seamless user experience",
    },
    {
      image: Slide6,
      alt: "24/7 Support",
      caption: "Always Available",
      description: "Our support team is ready to help you anytime",
    },
  ];
 
  const slidesToShow = slides && slides.length > 0 ? slides : defaultSlides;
  const [currentSlide, setCurrentSlide] = useState(0);
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesToShow.length);
    }, 5000); 
 
    return () => clearInterval(interval);
  }, [slidesToShow.length]);
 
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        // maxWidth: 600,
        margin: "0 auto",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        position: "relative",
      }}
    >
      {slidesToShow.map((slide, index) => (
        <Box
          key={index}
          sx={{
            display: index === currentSlide ? "block" : "none",
            position: "relative",
          }}
        >
          <Box
            component="img"
            src={slide.image}
            alt={slide.alt}
            loading="lazy"
            draggable={false}
            sx={{
              width: "100%",
              // height: 405,
              objectFit: "cover",
              objectPosition: "center",
              borderRadius: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
             // backgroundColor: "rgba(0, 0, 0, 0.5)",
              color: "white",
              padding: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {slide.caption}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {slide.description}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
 
export default ImageSlider;