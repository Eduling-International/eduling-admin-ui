/**
 * @file CoverPicker.tsx
 * @description UI component responsible of pick up course cover.
 *
 * @author manhhnv
 */

'use client';

import { Box, Stack, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import Image from 'next/image';
import { ImageSquare } from '@phosphor-icons/react/dist/ssr';
import { useFormContext } from 'react-hook-form';
import { COURSE_COVER_PREFIX, COURSE_COVERS } from '@/core/constants';

const DIMENSION = {
  WIDTH: 80,
  HEIGHT: 80,
};

const CoverPicker: React.FC = () => {
  const { setValue, watch } = useFormContext();
  const pickupCoverHandler = useCallback(
    (url: string) => {
      setValue('coverPicture', url);
    },
    [setValue],
  );
  return (
    <Stack spacing={3}>
      <Box display="flex" gap={1.5}>
        <ImageSquare size={25} weight="bold" />
        <Typography
          sx={{ opacity: 0.8 }}
          letterSpacing={0.5}
          fontWeight={500}
          fontSize={16}
          component="div"
        >
          Pick up cover
        </Typography>
      </Box>
      <Stack spacing={1} direction="row" sx={{ flexWrap: 'wrap' }}>
        {COURSE_COVERS.map((cover, index) => {
          return (
            <Box
              display={'inline-block'}
              sx={{
                cursor: 'pointer',
                opacity: watch('coverPicture') === cover ? 1 : 0.3,
              }}
              key={index}
              component="div"
              onClick={pickupCoverHandler.bind(null, cover)}
            >
              <Image
                src={`${COURSE_COVER_PREFIX}/${cover}`}
                alt={cover}
                width={DIMENSION.WIDTH}
                height={DIMENSION.HEIGHT}
              />
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default React.memo(CoverPicker);
