import React, { useState } from 'react'
import { IconPlus, IconX } from '@tabler/icons-react'
import Dot from './Dot';
import Heading from './Heading';

const faqs: { question: string; answer: string }[] = [
  {
    question: 'What services do you offer?',
    answer:
      'We provide video editing, custom video production, content strategy development, social media optimization, and more, tailored to meet your needs.',
  },
  { question: 'How long does it take to complete a video project?', answer: '' },
  { question: 'Do you offer revisions?', answer: '' },
  { question: 'What platforms do you create videos for?', answer: '' },
  { question: 'Can I provide my own footage for editing?', answer: '' },
  { question: 'How do I get started?', answer: '' },
]

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number>(0)

  return (
    <section className="py-16">
      <div className='flex items-center justify-center mb-10 flex-col'>
               {/* <Dot name="FAQ's"/> */}


          <Heading heading={"Frequently asked quesions from our users"} subheading={""}/>


      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Heading and CTA card */}
          <div>
           
          

            <div className="bg-primary text-white rounded-3xl p-6 sm:p-8 inline-flex items-center justify-between gap-6 w-full max-w-2xl">
              <div className="text-md leading-snug">
                <p>Have a question?</p>
                <p>Let’s discuss it now!</p>
              </div>
              <button className="shrink-0 bg-white text-black dark:text-[#000] rounded-full px-6 py-3 text-sm font-medium hover:opacity-90 transition">
                Book an appointment
              </button>
            </div>
          </div>

          {/* Right: Accordion */}
          <div className="space-y-4">
            {faqs.map((item, index) => {
              const isOpen = openIndex === index
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-colors dark:bg-third dark:border-none ${
                    isOpen ? 'bg-white border-gray-200 shadow-sm ' : 'bg-white border-gray-100'
                  }`}
                >
                  <button
                    className="w-full flex items-center justify-between gap-6 text-left p-6"
                    onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  >
                    <span className="text-sm md:text-md font-medium text-black">{item.question}</span>
                    <span className="text-primary bg-secondary rounded-full p-1">
                      {isOpen ? <IconX size={22} /> : <IconPlus size={22} />}
                    </span>
                  </button>
                  {isOpen && item.answer && (
                    <div className="px-6 pb-6 -mt-2 text-sm text-lightBlack">
                      {item.answer}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ