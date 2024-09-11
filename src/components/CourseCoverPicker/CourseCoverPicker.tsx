import { Stack, Box, Typography } from '@mui/material';
import { imageURLPrefix, covers } from './config';
import * as React from 'react';
import { ImageSquare } from '@phosphor-icons/react';
import Image from 'next/image';

interface CourseCoverPickerProps {
  value: string;
  onChange: (image: string) => void;
  error?: boolean;
  helperText?: string;
}

export const CourseCoverPicker: React.FC<CourseCoverPickerProps> = React.memo(
  ({ value, onChange, error, helperText }) => {
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
            Pick a cover
            {error && (
              <span
                style={{ margin: '0 3px 0 3px', color: 'red', fontSize: 14 }}
              >
                ({helperText} *)
              </span>
            )}
          </Typography>
        </Box>
        <Stack spacing={1} direction="row" sx={{ flexWrap: 'wrap' }}>
          {covers.map((cover, index) => {
            return (
              <Box
                display={'inline-block'}
                sx={{
                  cursor: 'pointer',
                  opacity: value === cover ? 1 : 0.3,
                }}
                key={index}
                component="div"
                onClick={onChange.bind(null, cover)}
              >
                <Image
                  src={`${imageURLPrefix}/${cover}`}
                  alt={cover}
                  width={80}
                  height={80}
                />
              </Box>
            );
          })}
        </Stack>
      </Stack>
    );
  },
);
