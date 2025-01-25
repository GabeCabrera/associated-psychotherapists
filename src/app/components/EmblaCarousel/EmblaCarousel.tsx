import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Avatar, Rating, Typography } from '@mui/material'

type PropType = {

  slides: { key: number; title: string; description: string; avatar: string, rating: number;}[]

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
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          {slides.map((slide) => (
            <div className="embla__slide" key={slide.key}>
              <div className="embla__slide__number">
                  <img className='embla-slide-quote' src='/quote-15-double-open.svg' alt='quote' width={20} />
                <span className='embla__slide__number__inner'>
                  <Typography variant="h5">
                    {slide.title}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary" className='embla-slide-description'>
                    <Avatar className='embla-avatar' sx={{ bgcolor: slide.avatar }}>{slide.description.charAt(0)}</Avatar>&nbsp;{slide.description}
                    <Rating name="read-only" value={slide.rating} precision={0.5} readOnly sx={{ px: 1 }} />
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                  </Typography>
                </span>
                  <img className='embla-slide-quote' src='/quote-17-double-close.svg' alt='quote' width={20} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
