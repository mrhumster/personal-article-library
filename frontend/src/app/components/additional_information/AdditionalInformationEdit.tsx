import React, {useEffect, useRef, useState} from "react";
import { Text } from '@consta/uikit/Text'
import {getAdditionInformationFormByType} from "./getAdditionInformationFormByType.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {useUpdateArticleMutation} from "../../services/backend";
import {getAdditionInformationTableByType} from "./getAdditionInformationTableByType.tsx";
import {Button} from "@consta/uikit/Button";
import {IconSelect} from "@consta/icons/IconSelect"
import {IconSelectOpen} from "@consta/icons/IconSelectOpen"

export const AdditionalInformationEdit = () => {
  const [active, setActive] = useState<boolean>(false)
  const [moreInfo, setMoreInfo] = useState<boolean>(false)
  const formRef = useRef<HTMLInputElement>(null)
  const moreInfoRef = useRef<HTMLInputElement>(null)
  const lessInfoRef = useRef<HTMLInputElement>(null)
  const showMoreInfoRef = useRef<HTMLInputElement>(null)
  const showLessInfoRef = useRef<HTMLInputElement>(null)
  const current_article = useSelector((state: RootState) => state.articles.current_article)
  const [updateArticle] = useUpdateArticleMutation()


  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (formRef.current) {
      if (!formRef.current.contains(e.target as Node)) {
        setActive(false);
        setMoreInfo(true)
        updateArticle({...current_article, additional_information: current_article?.additional_information})
      }
    }
    if (moreInfoRef.current) {
      if (!moreInfoRef.current.contains(e.target as Node)) {
        setActive(false);
        // setMoreInfo(false)
        updateArticle({...current_article, additional_information: current_article?.additional_information})
      }
    }
  }

  const handleClickInside = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (lessInfoRef.current && showMoreInfoRef.current) {
      if (showMoreInfoRef.current.contains(e.target as Node)) {
        setMoreInfo(true)
      } else {
        setActive(true)
      }
    }
    if (moreInfoRef.current && showLessInfoRef.current) {
      if (showLessInfoRef.current.contains(e.target as Node)) {
        setMoreInfo(false)
      } else {
        setActive(true)
      }
    }
  }


  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });

  const reference_type = useSelector((state: RootState) => state.articles.current_article?.reference_type)
  const additionInformationForm = getAdditionInformationFormByType(reference_type)

  return (
    <>
      {!active &&
        <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted py-1 bg-zinc-100" onClick={handleClickInside}>
          { !moreInfo && !current_article?.additional_information &&
            <Text size={'s'} weight={'light'} cursor={'pointer'} fontStyle={'italic'}>
                <span onClick={() => setActive(true)} className={'ms-1'}>Добавить дополнительную информацию</span>
            </Text>
          }
          { !moreInfo && current_article?.additional_information &&
            <div ref={lessInfoRef} className={'w-full px-1'}>
              <Button
                  iconLeft={IconSelect}
                  iconRight={IconSelect}
                  label={'Показать дополнительную информацию'}
                  width={'full'}
                  size={'xs'}
                  view={'clear'}
                  onClick={() => setMoreInfo(true)}/>
            </div>
          }
          { moreInfo &&
              <div ref={moreInfoRef} className={'select-user'}>
                {getAdditionInformationTableByType(reference_type)}
                <div ref={showLessInfoRef} className={'w-full px-1'}>
                  <Button
                      iconLeft={IconSelectOpen}
                      iconRight={IconSelectOpen}
                      label={'Скрыть дополнительную информацию'}
                      width={'full'}
                      size={'xs'}
                      view={'clear'}
                      onClick={() => setMoreInfo(false)}/>
                </div>
              </div>
          }
        </Text>
      }
      { active &&
        <div className="border rounded border-sky-700" ref={formRef} onClick={handleClickInside}>
          {additionInformationForm}
        </div>
      }
    </>
  )
}