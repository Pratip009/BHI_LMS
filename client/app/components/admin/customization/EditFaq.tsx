import { styles } from '../../../styles/style'
import { useEditLayoutMutation, useGetHeroDataQuery } from '@/redux/features/layout/layoutApi'
import React, { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import { AiOutlineDelete } from 'react-icons/ai'
import { HiMinus, HiPlus } from 'react-icons/hi'
import { IoMdAddCircleOutline } from 'react-icons/io'

type Props = {}

const EditFaq = (props: Props) => {
  const { data, error, refetch } = useGetHeroDataQuery("FAQ", {
    refetchOnMountOrArgChange: true,
  })
  const [editLayout, { isSuccess: layoutSuccess }] = useEditLayoutMutation()

  const [questions, setQuestions] = useState<any[]>([])
  const [originalQuestions, setOriginalQuestions] = useState<any[]>([])

  useEffect(() => {
    if (data) {
      const loadedFaq = data.layout.faq.map((item: any) => ({ ...item, active: false }))
      setQuestions(loadedFaq)
      setOriginalQuestions(loadedFaq)
    }
  }, [data])

  useEffect(() => {
    if (layoutSuccess) {
      toast.success("FAQ updated successfully")
      refetch()
    }
    if (error && "data" in error) {
      const errorData = error as any
      toast.error(errorData.data.message)
    }
  }, [layoutSuccess, error, refetch])

  const toggleQuestion = (id: string) => {
    setQuestions(prev =>
      prev.map(q => q._id === id ? { ...q, active: !q.active } : q)
    )
  }

  const handleChange = (id: string, field: 'question' | 'answer', value: string) => {
    setQuestions(prev =>
      prev.map(q => q._id === id ? { ...q, [field]: value } : q)
    )
  }

  const handleDelete = (id: string) => {
    setQuestions(prev => prev.filter(q => q._id !== id))
  }

  const addNewFaq = () => {
    setQuestions(prev => [
      ...prev,
      {
        _id: Date.now().toString(),
        question: '',
        answer: '',
        active: true,
      }
    ])
  }

  const isAnyEmpty = useMemo(() => {
    return questions.some(q => q.question.trim() === '' || q.answer.trim() === '')
  }, [questions])

  const isUnchanged = useMemo(() => {
    const cleanedCurrent = questions.map(({ _id, question, answer }) => ({ _id, question, answer }))
    const cleanedOriginal = originalQuestions.map(({ _id, question, answer }) => ({ _id, question, answer }))
    return JSON.stringify(cleanedCurrent) === JSON.stringify(cleanedOriginal)
  }, [questions, originalQuestions])

  const handleSave = async () => {
    if (isUnchanged || isAnyEmpty) return
    const cleanedFaq = questions.map(({ _id, question, answer }) => ({ _id, question, answer }))
    await editLayout({
      type: 'FAQ',
      faq: cleanedFaq
    })
  }

  return (
    <div className="w-[90%] 800px:w-[80%] m-auto mt-[120px]">
      <div className="mt-10 space-y-6">
        <h2 className="text-2xl font-semibold dark:text-white text-black">Edit FAQ</h2>
        <dl className="space-y-6">
          {questions.map((q) => (
            <div key={q._id} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
              <dt className="flex justify-between items-center">
                <input
                  className={`${styles.input} border-none w-full`}
                  value={q.question}
                  onChange={(e) => handleChange(q._id, 'question', e.target.value)}
                  placeholder="Enter question..."
                />
                <button
                  onClick={() => toggleQuestion(q._id)}
                  className="ml-4 text-xl dark:text-white text-black"
                >
                  {q.active ? <HiMinus /> : <HiPlus />}
                </button>
              </dt>
              {q.active && (
                <dd className="mt-3 flex items-center gap-4">
                  <input
                    className={`${styles.input} border-none w-full`}
                    value={q.answer}
                    onChange={(e) => handleChange(q._id, 'answer', e.target.value)}
                    placeholder="Enter answer..."
                  />
                  <AiOutlineDelete
                    className="text-red-500 hover:text-red-700 cursor-pointer text-xl"
                    onClick={() => handleDelete(q._id)}
                  />
                </dd>
              )}
            </div>
          ))}
        </dl>

        <div className="flex items-center gap-2 mt-6 cursor-pointer" onClick={addNewFaq}>
          <IoMdAddCircleOutline className="text-2xl dark:text-white text-black" />
          <span className="dark:text-white text-black font-medium">Add Question</span>
        </div>

        <div className="w-full flex justify-end mt-10">
          <button
            disabled={isUnchanged || isAnyEmpty}
            onClick={handleSave}
            className={`transition-all px-6 py-2 min-h-[40px] rounded text-white font-semibold
              ${isUnchanged || isAnyEmpty
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 cursor-pointer'}
            `}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditFaq
