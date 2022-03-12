import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(
    JSON.parse(`
      {
        "status_code": 200,
        "success": true,
        "message": "success get list data",
        "data": [
          {
            "district_type": "Mining",
            "summary_data": [
              {
                "district_code": "JIEP",
                "actual_ytd_current_period": 80000000,
                "outstanding_pr_po": 11765,
                "outstanding_budgets": 0,
                "total_outstanding": 11765,
                "total_estimate_full_year_current_period": 80011765,
                "adjustment_outstanding_pr_po": -11765,
                "adjustment_outstanding_budgets": 0,
                "total_adjustment_current_period": -11765,
                "outstanding_plan_s2_current_period": 0,
                "estimater_outlook_fy_current_period": 80000000,
                "approval_capex": 22000000,
                "carry_over_pr_previouse_period": 0,
                "carry_over_plan_previouse_period": 0,
                "total_mb": 28000000,
                "mb_vs_ol_fy_current_period": -58000000,
                "mb_vs_ol_fy_current_period_percentage": -263
              },
              {
                "district_code": "ABKL",
                "actual_ytd_current_period": 70000000,
                "outstanding_pr_po": 12765,
                "outstanding_budgets": 0,
                "total_outstanding": 12765,
                "total_estimate_full_year_current_period": 80012765,
                "adjustment_outstanding_pr_po": -12765,
                "adjustment_outstanding_budgets": 0,
                "total_adjustment_current_period": -12765,
                "outstanding_plan_s2_current_period": 0,
                "estimater_outlook_fy_current_period": 70000000,
                "approval_capex": 22000000,
                "carry_over_pr_previouse_period": 0,
                "carry_over_plan_previouse_period": 0,
                "total_mb": 25000000,
                "mb_vs_ol_fy_current_period": -57000000,
                "mb_vs_ol_fy_current_period_percentage": -263
              }
            ]
          },
          {
            "district_type": "Others",
            "summary_data": [
              {
                "district_code": "BBSO",
                "actual_ytd_current_period": 80000000,
                "outstanding_pr_po": 11765,
                "outstanding_budgets": 0,
                "total_outstanding": 11765,
                "total_estimate_full_year_current_period": 80011765,
                "adjustment_outstanding_pr_po": -11765,
                "adjustment_outstanding_budgets": 0,
                "total_adjustment_current_period": -11765,
                "outstanding_plan_s2_current_period": 0,
                "estimater_outlook_fy_current_period": 80000000,
                "approval_capex": 22000000,
                "carry_over_pr_previouse_period": 0,
                "carry_over_plan_previouse_period": 0,
                "total_mb": 22000000,
                "mb_vs_ol_fy_current_period": -58000000,
                "mb_vs_ol_fy_current_period_percentage": -263
              },
              {
                "district_code": "BPOP",
                "actual_ytd_current_period": 100000000,
                "outstanding_pr_po": 12765,
                "outstanding_budgets": 0,
                "total_outstanding": 12765,
                "total_estimate_full_year_current_period": 80012765,
                "adjustment_outstanding_pr_po": -12765,
                "adjustment_outstanding_budgets": 0,
                "total_adjustment_current_period": -12765,
                "outstanding_plan_s2_current_period": 0,
                "estimater_outlook_fy_current_period": 70000000,
                "approval_capex": 22000000,
                "carry_over_pr_previouse_period": 0,
                "carry_over_plan_previouse_period": 0,
                "total_mb": 25000000,
                "mb_vs_ol_fy_current_period": -57000000,
                "mb_vs_ol_fy_current_period_percentage": -263
              }
            ]
          }
        ],
        "errors": null
      }
    `)
  );
}
