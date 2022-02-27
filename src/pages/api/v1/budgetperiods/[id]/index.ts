import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get detail data",
        "data": {
          "id": "329714c0-c1a3-44e1-b355-b71eb1a0cc64",
          "district_code": "JIEP",
          "year": 2022,
          "type": "MB",
          "position": "UNFINAL",
          "status": "OPEN",
          "open_date": "2022-01-01",
          "close_date": "2022-01-20"
        },
        "errors": null
      }
    `)
  );
}
