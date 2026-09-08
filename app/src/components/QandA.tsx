import './QandA.css'

const faqs = [
  {
    question: 'When is the RSVP deadline?',
    answerBefore: 'Please RSVP by ',
    highlight: 'January 5th',
    answerAfter: ', so we can have an accurate headcount :)',
  },
  {
    question: 'Can I bring a date?',
    answerBefore: 'Please check your invite for your +1!',
    highlight: '',
    answerAfter: '',
  },
  {
    question: 'Are kids welcomed?',
    answerBefore: 'Please check your invite thankyou :)',
    highlight: '',
    answerAfter: '',
    subtext: 'Please reach out if you have questions!',
  },
  {
    question: 'What should I wear?',
    answerBefore: 'Please refrain from wearing white, rustic, and taupe colored dresses and wine and burgundy colored suits',
    highlight: '',
    answerAfter: '',
  },
]

export default function QandA() {
  return (
    <div className="q-and-a">
      <h2>Q&A</h2>
      {faqs.map((faq, i) => (
        <div key={i} className="qa-pair">
          <p className="qa-question">Q: {faq.question}</p>
          <p className="qa-answer">
            {faq.answerBefore}
            {faq.highlight && <span className="qa-highlight">{faq.highlight}</span>}
            {faq.answerAfter}
          </p>
          {faq.subtext && <p className="qa-subtext">{faq.subtext}</p>}
        </div>
      ))}
    </div>
  )
}
