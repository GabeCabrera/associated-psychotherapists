import React from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import { DotButton, useDotButton } from './EmblaCarouselDotButton'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons
} from './EmblaCarouselArrowButtons'
import useEmblaCarousel from 'embla-carousel-react'
import { Avatar, Typography } from '@mui/material'

type PropType = {

  slides: { key: number; title: string; description: string; avatar: string;}[]

  options?: EmblaOptionsType

}

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick
  } = usePrevNextButtons(emblaApi)

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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

        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={'embla__dot'.concat(
                index === selectedIndex ? ' embla__dot--selected' : ''
              )}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
