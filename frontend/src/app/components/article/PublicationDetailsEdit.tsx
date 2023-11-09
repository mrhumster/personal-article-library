import React, {useEffect, useRef, useState} from "react";
import {Text} from "@consta/uikit/Text";
import {publicationDetailToString} from "../main";
import {useSelector} from "react-redux";
import {RootState} from "../../store";
import {Grid, GridItem} from "@consta/uikit/Grid";
import {TextField} from "@consta/uikit/TextField";

export const PublicationDetailsEdit = () => {
  const [active, setActive] = useState<boolean>(false)
  const pubDetails = useSelector((state: RootState) => state.articles.current_article?.publication)
  const myRef = useRef<HTMLInputElement>(null);

  const handleClickOutside = (e: TouchEvent | MouseEvent) => {
    if (myRef.current) {
      if (!myRef.current.contains(e.target as Node)) {
        setActive(false);
      }
    }
  }

  const handleClickInside = () => setActive(true);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });


  return (
    <>
      {!active &&
          <Text className="border rounded border-transparent hover:border-sky-700 hover:border-dotted"
                onClick={() => setActive(true)}>
            {publicationDetailToString(pubDetails)}
          </Text>
      }
      {active &&
          <div className="border rounded border-sky-700" ref={myRef} onClick={handleClickInside}>
              <Grid className={'p-3'} cols={2} rowGap={'m'} colGap={'m'}>
                  <GridItem col={2}>
                      <TextField size={'s'} width={'full'} label={'Название'}></TextField>
                  </GridItem>
                  <GridItem>
                      <TextField size={'s'} label={'Год'}></TextField>
                  </GridItem>
                  <GridItem className={'flex items-end'}>
                          <TextField size={'s'} className={'self-end me-1'} label={'Страницы'} ></TextField>
                          <TextField size={'s'} className={'self-end ms-1'}></TextField>
                  </GridItem>
                  <GridItem col={2}>
                      <TextField size={'s'} width={'full'} label={'Том'}></TextField>
                  </GridItem>
              </Grid>
          </div>
      }
    </>
  )
}