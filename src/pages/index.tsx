import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Fragment, useState, useEffect } from "react"


const Home: NextPage = () => {
  const [userMessage, setUserMessage] = useState(examplePatientDescription)
  const [messages, setMessages] = useState(
    [
      { role: "system", "content": "You are a helpful assistant for a doctor." },
    ])
  const [findings, setFindings] = useState('')
  const [diagnoses, setDiagnoses] = useState('')
  const [triage, setTriage] = useState('')
  const [treatment, setTreatment] = useState('')
  const [confidence, setConfidence] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const send = (messages: any[], cb: () => void, setResponse?: (r: any) => void) => {
    setIsLoading(true)
    fetch('/api/openai/chat', {
      method: "POST",
      body: JSON.stringify({ messages }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(r => r.json()).then(r => {
      setMessages([...messages, r.message])
      setResponse?.(prev => prev + r.message.content)
      setIsLoading(false)
      cb()
    })
  }

  const rewriteThis = () => {
    const messages0 = [...messages, { role: "user", "content": `${userMessage}\n Rewrite this with 3 bullet points summary` }]
    send(messages0, () => {
      setMessages(prev => [...prev, { role: "assistant", content: "What tests results do we have from this person?" }])
      setStepIndex(p => p + 1)
      setUserMessage(exampleTestResults)
    }, setFindings)
  }
  const sendTest = () => {
    const messages0 = [...messages, { role: "user", "content": `${userMessage}\n Rewrite this with 1 bullet point summary` }]
    send(messages0, () => {
      setMessages(prev => [...prev, { role: "assistant", content: "What is one question would you ask to narrow down the diagnostics? Only include the question itself in the response" }])
      setStepIndex(p => p + 1)
      setUserMessage("")
    }, setFindings)
  }
  const narrow = () => {
    const messages0 = [...messages, { role: "user", "content": `${userMessage}` }]
    send(messages0, () => {
      setMessages(prev => [...prev, { role: "assistant", content: "What is one question would you ask to narrow down the diagnostics? Only include the question itself in the response" }])
      setUserMessage("")
    })
  }
  const steps = { 0: { fn: rewriteThis, buttonText: 'rewrite this' }, 1: { fn: sendTest, buttonText: 'send test results' }, 2: { fn: narrow, buttonText: 'narrow' } }
  const suggestDiagnoses = () => {
    const messages0 = [...messages, { role: "user", "content": `what would the most likely diagnoses be for a doctor to review` }]
    send(messages0, () => {
      setUserMessage("")
    }, setDiagnoses)
  }
  const suggestTriage = () => {
    const messages0 = [...messages, { role: "user", "content": `suggest triage for a doctor to review` }]
    send(messages0, () => {
      setUserMessage("")
    }, setTriage)
  }
  const suggestTreatment = () => {
    const messages0 = [...messages, { role: "user", "content": `suggest treatment for a doctor to review` }]
    send(messages0, () => {
      setUserMessage("")
    }, setTreatment)
  }
  const suggestConfidence = () => {
    const messages0 = [...messages, { role: "user", "content": `suggest a confidence percent for a doctor to review` }]
    send(messages0, () => {
      setUserMessage("")
    }, setConfidence)
  }
  const [stepIndex, setStepIndex] = useState(0)
  const step = steps[stepIndex]
  console.log('step', step)


  const sendUserMessage = (userMessage: string) => {
    const messages0 = [...messages, { role: "user", content: userMessage }]
    setUserMessage('')
    send(messages0)
  }

  const [open, setOPen] = useState(false);
  const toggle = () => {
    setOPen(!open);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>CareWell</title>
        <meta name="description" content="Copilot to help doctors diagnose and prioritise their patients." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div>
        <button onClick={toggle} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-white">Instructions</button>
        {open && <blockquote className="p-4 my-4 border-l-4 border-blue-300 bg-blue-50 bg-blue-100">Welcome to CoPilot for Doctors! I’ll be your copilot for this consultation. I’m capable of summarizing information, x, and y.
          Over the course of our conversation, I’ll present a working model of our findings in the area below. You can interact with our findings to change, edit, or clarify information.</blockquote>}
      </div>
      <main>
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-white m-3">
            CareWell
          </h1>
          <h1 className="mb-6 text-lg font-normal lg:text-xl sm:px-16 xl:px-48 text-gray-400">
            We Allow Doctors to Get Back to What Matters The Most, Serving Patients
          </h1>
        </div>
        <div className="flex" style={{ height: '80vh' }} >
          <div aria-label='left' className='flex flex-col' style={{ width: '50%' }}>
          <div className='flex content-center justify-center'>
            <h2 className='text-white font-bold text-3xl mb-5'>Chat</h2>
            </div>
            <div className='min-h-fit'>
              <textarea 
              value={userMessage}
              onChange={e => setUserMessage(e.target.value)}
              className='border text-sm rounded-lg block w-full h-full h-25 p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500'
              aria-label="Input">
              </textarea>
            </div>
            <div className="flex">
              {step && <button onClick={step.fn} className={buttonClass}>{step.buttonText}</button>}
              {stepIndex === 2 && <>
                <button className={buttonClass} onClick={suggestDiagnoses}>suggest diagnoses</button>
                <button className={buttonClass} onClick={suggestTriage}>suggest triage</button>
                <button className={buttonClass} onClick={suggestTreatment}>suggest treatment</button>
                <button className={buttonClass} onClick={suggestConfidence}>suggest confidence</button>
              </>}
            </div>
            <div aria-label='messages' style={{ height: '50vh', overflow: 'scroll' }}>
              {messages.slice(1).map((m, i) => <Fragment key={i}><div><span className='text-white ml-8'>{m.role}: </span><p className='text-white ml-5'>{m.content}</p></div><br />        </Fragment>)}
            </div>
          </div>
          <div aria-label='right' style={{ width: '50%' }}>
            <div className='flex content-center justify-center'>
            <h2 className='text-white font-bold text-3xl mb-5'>Findings</h2>
            </div>
            <div className="border-4 border-amber-500 ml-3 p-3 mr-3 rounded-md">
              <ul>
                <li className='text-white'>{findings}</li>
                <br />
                {diagnoses && <>
                  <h2 className='text-white'>Diagnoses</h2>
                  <li className='text-white'>{diagnoses}</li>
                  <br />
                </>}
                {triage && <>
                  <h2 className='text-white'>Triage</h2>
                  <li className='text-white'>{triage}</li>
                  <br />
                </>}
                {treatment && <>
                  <h2 className='text-white'>Treatment</h2>
                  <li className='text-white'>{treatment}</li>
                  <br />
                </>}
                {confidence && <>
                  <h2 className='text-white'>Confidence</h2>
                  <li className='text-white'>{confidence}</li>
                </>}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const buttonClass = "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-4 mt-3 ml-3"
const examplePatientDescription = "A 76-year-old man with known heart disease is admitted to the hospital because of new onset of shortness of breath, fatigue, and atrial fibrillation. He denies weight loss, nervousness, and insomnia. There is no evidence of an acute myocardialinfarction or pulmonary embolus."
const exampleTestResults = `On physical examination, his heart rate is 136 beats per minute; beats are irregularlyirregular; and fine rales are heard at both lung bases. His blood pressure is 152/82 mm Hg, without orthostaticchanges.
Results of laboratory tests indicate a hemoglobin level of 14.6 g/dL, a TSH level of 0.02 μU/mL (normal, 0.45to 4.5 μU/mL), and an FT4 level of 3.3 ng/dL (normal, 0.61 to 1.76 ng/dL).`

const promptQualify = "You are a helpful assistant at a doctor office. You help qualify the user (patient) for diagnosis."
export default Home