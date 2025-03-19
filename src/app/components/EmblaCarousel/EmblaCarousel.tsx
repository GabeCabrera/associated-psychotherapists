import React from 'react';
import { Avatar, Container, Rating } from '@mui/material';
import Typography from '@mui/material/Typography';
import useEmblaCarousel from 'embla-carousel-react';
import { PrevButton, NextButton, usePrevNextButtons } from './EmblaCarouselArrowButtons';
import { EmblaOptionsType } from 'embla-carousel';

type PropType = {

  slides: { key: number; title: string; description: string; avatar: string, rating: number; }[]

  options?: EmblaOptionsType

}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)


  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  return (
    <Container className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <Container className="embla__slide" key={slide.key}>
              <Container className="embla__slide__number">
                <img className='embla-slide-quote' src='/quote-15-double-open.svg' alt='quote' width={20} />
                <Container className='embla__slide__number__inner'>
                  <Typography className='embla-slide-title'>
                    {slide.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" className='embla-slide-description'>
                    <Avatar className='embla-avatar' sx={{ bgcolor: slide.avatar }}>{slide.description.charAt(0)}</Avatar>&nbsp;{slide.description}
                    <Rating name="read-only" value={slide.rating} precision={0.5} readOnly sx={{ px: 1 }} />
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                  </Typography>
                </Container>
                <img className='embla-slide-quote' src='/quote-17-double-close.svg' alt='quote' width={20} />
              </Container>
            </Container>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </Container>
  )
}

export default EmblaCarousel
