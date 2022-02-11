import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get detail data",
        "data": {
          "id": "211afc10-4f0e-493d-9931-f2ff60d500cd",
          "asset_group": "Computer Equipment",
          "asset_group_code": "CE",
          "pics": [
            {
              "district_code": "JIEP",
              "dept_code": "TREA"
            }
          ],
          "created_at": "2021-08-23 11:34:41"
        },
        "errors": null
      }
    `)
  );
}
