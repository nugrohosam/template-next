// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ResponseError } from 'modules/common/types';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseError>
) {
  res.status(422).json({
    statusCode: 422,
    success: false,
    message: 'unprocessable entity',
    errors: {
      code: 1001,
      message: {
        districtCode: 'district code is required.',
        year: 'year is required.',
      },
    },
  });
}
