import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get list data",
        "data": {
          "paging": {
            "total_items": 1,
            "page_number": 1,
            "page_size": 1,
            "total_pages": 1
          },
          "links": [
            {
              "href": "https://localhost:5001/api/v1/summaries/xxx-xxx-xxx?page_number=1&page_size=3",
              "rel": "self",
              "method": "GET"
            }
          ],
          "items": [
            {
              "id_budget_plan": "xxx-xxx-xxx",
              "district_code": "ABKL",
              "actual_ytd_current_period": 80000000,
              "outstanding_pr_po": 11765,
              "outstanding_budgets": 0,
              "total_outstanding": 11765,
              "total_estimate_full_year_current_period": 80011765,
              "adjustment_outstanding_pr_po": -11765,
              "adjustment_outstanding_budgets": 0,
              "total_adjustment_current_period": -11765,
              "outstanding_plan_s2_current_period": 0,
              "estimate_outlook_fy_current_period": 80000000,
              "approval_capex": 22000000,
              "carry_over_pr_previous_period": 0,
              "carry_over_plan_previous_period": 0,
              "total_mb": 22000000,
              "mb_vs_ol_fy_current_period": -58000000,
              "mb_vs_ol_fy_current_period_percentage": -263
            }
          ]
        },
        "errors": null
      }
    `)
  );
}
