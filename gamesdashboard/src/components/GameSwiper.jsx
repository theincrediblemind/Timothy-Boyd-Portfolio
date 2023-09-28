import React, {useState} from 'react'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/navigation';
import './gameswiper.css';
// import required modules
import { EffectCoverflow, Navigation, Autoplay } from 'swiper/modules';


function GameSwiper({games}) {
    const [active, setActive] = useState(false);

    const toggleVideo=()=>{
        setActive(!active);
    }

  return (
    <>
    <Swiper
    effect={'coverflow'}
    grabCursor={true}
    navigation={true}
    loop={true}
    centeredSlides={true}
    slidesPerView={'auto'}
    coverflowEffect={{
        rotate: 35,
        stretch:200,
        depth:250,
        modifier:1,
        slideShadows:true,
    }}
    // autoplay={{
    //     delay:2500,
    //     disableOnInteraction: false,
    // }}
    modules={[EffectCoverflow, Navigation, Autoplay]}
    className='gameSwiper'
    >
        {
            games.map(game=>(
                <SwiperSlide key={game._id}>
                    <div className="gameSlider">
                        <img src={game.img} alt={`${game.title}`}></img>
                        <div className={`video ${active ? 'active' : undefined}`}>
                        <iframe width="1280" height="720" 
                        src={`${game.trailer}?autoplay=1&mute=1`} 
                        title={game.title} 
                        frameborder="0" 
                        allow="accelerometer; 
                        autoplay; 
                        clipboard-write; 
                        encrypted-media; 
                        gyroscope; 
                        picture-in-picture; 
                        web-share" allowfullscreen
                        ></iframe>
                        </div>
                        <div className="content">
                            <h2 className="title">{game.title}</h2>
                            <p className="description">{game.description}</p>
                            <div className="buttons">
                                <a href="#" className="orderBtn">Order Now</a>
                                <a href="#" className={`playBtn ${active ? 'active' : undefined}`} onClick={toggleVideo}>
                                    <span className="pause">
                                        <i className="bi bi-pause-fill"></i>
                                    </span>
                                    <span className="play">
                                        <i className="bi bi-play-fill"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))
        }
    </Swiper>
    </>
  )
}

export default GameSwiper