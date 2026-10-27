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
    answerBefore: '',
    highlight: '',
    answerAfter: '',
    groups: [
      {
        label: 'Ladies ~ No white or bronzer dresses',
        colors: [
          { name: 'White', hex: '#FFFFFF' },
          { name: 'Bronzer', hex: '#C0805E' },
        ],
      },
      {
        label: 'Gentlemen ~ No sage, olive, taupe, or beige suits',
        colors: [
          { name: 'Sage', hex: '#9CAF88' },
          { name: 'Olive', hex: '#808000' },
          { name: 'Taupe', hex: '#54463A' },
          { name: 'Beige', hex: '#F5F5DC' },
        ],
      },
    ],
  },
]

export default function QandA() {
  return (
    <div className="q-and-a">
      <h2>Q&A</h2>
      {faqs.map((faq, i) => (
        <div key={i} className="qa-pair">
          <p className="qa-question">Q: {faq.question}</p>
          {(faq.answerBefore || faq.answerAfter) && (
            <p className="qa-answer">
              {faq.answerBefore}
              {faq.highlight && <span className="qa-highlight">{faq.highlight}</span>}
              {faq.answerAfter}
            </p>
          )}
          {faq.subtext && <p className="qa-subtext">{faq.subtext}</p>}
          {faq.groups && (
            <div className="qa-groups">
              {faq.groups.map((group) => (
                <div key={group.label} className="qa-group">
                  <p className="qa-subtext">{group.label}</p>
                  <div className="qa-swatches">
                    {group.colors.map((c) => (
                      <span key={c.name} className="qa-swatch" title={c.name}>
                        <span
                          className="qa-dot"
                          style={{ backgroundColor: c.hex }}
                          aria-label={`${c.name} banned`}
                          role="img"
                        />
                        <span className="qa-color-name">{c.name}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
