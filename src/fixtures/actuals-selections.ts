export const planData = {

    name: 'innoTest',
    description: '',
    reportingPeriods: [
      {
        key: '383',
        id: '2026/01',
        href: '/objects/general-ledger/reporting-period/383',
      },
      {
        key: '384',
        id: '2026/02',
        href: '/objects/general-ledger/reporting-period/384',
      },
      {
        key: '385',
        id: '2026/03',
        href: '/objects/general-ledger/reporting-period/385',
      },
      {
        key: '386',
        id: '2026/04',
        href: '/objects/general-ledger/reporting-period/386',
      },
      {
        key: '387',
        id: '2026/05',
        href: '/objects/general-ledger/reporting-period/387',
      },
      {
        key: '388',
        id: '2026/06',
        href: '/objects/general-ledger/reporting-period/388',
      },
      {
        key: '389',
        id: '2026/07',
        href: '/objects/general-ledger/reporting-period/389',
      },
      {
        key: '390',
        id: '2026/08',
        href: '/objects/general-ledger/reporting-period/390',
      },
      {
        key: '391',
        id: '2026/09',
        href: '/objects/general-ledger/reporting-period/391',
      },
      {
        key: '392',
        id: '2026/10',
        href: '/objects/general-ledger/reporting-period/392',
      },
      {
        key: '393',
        id: '2026/11',
        href: '/objects/general-ledger/reporting-period/393',
      },
      {
        key: '394',
        id: '2026/12',
        href: '/objects/general-ledger/reporting-period/394',
      },
    ],
    dimensionsIds: ['location', 'project', 'department'],
    accountsStructure: [
      {
        accounts: [
          {
            id: '4100',
            key: '51',
            href: '/objects/general-ledger/account/51',
            name: 'Revenue - Subscriptions',
            accountType: 'incomeStatement',
            updatedAt: 1754462650,
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: '4120',
            key: '52',
            href: '/objects/general-ledger/account/52',
            name: 'Revenue - Professional Services',
            accountType: 'incomeStatement',
            updatedAt: 1754462650,
          },
        ],
        dimensions: ['location', 'project'],
      },
      {
        accounts: [
          {
            id: '4130',
            key: '53',
            href: '/objects/general-ledger/account/53',
            name: 'Revenue - Usage',
            accountType: 'incomeStatement',
            updatedAt: 1754462650,
          },
          {
            id: '4200',
            key: '54',
            href: '/objects/general-ledger/account/54',
            name: 'Revenue - Reimbursed Expenses',
            accountType: 'incomeStatement',
            updatedAt: 1754462650,
          },
        ],
        dimensions: ['location', 'project', 'department'],
      },
    ],
    statisticalAccountsStructure: [
      {
        accounts: [
          {
            id: '1111',
            name: 'test',
            key: '148',
            href: '/objects/general-ledger/statistical-account/148',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: '1234',
            name: 'headcount',
            key: '144',
            href: '/objects/general-ledger/statistical-account/144',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: '9099',
            name: 'CMRR Customer Count',
            key: '134',
            href: '/objects/general-ledger/statistical-account/134',
            reportType: 'cumulative',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'CUST',
            name: 'Customer Count',
            key: '121',
            href: '/objects/general-ledger/statistical-account/121',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'EECO',
            name: 'Employee Count',
            key: '136',
            href: '/objects/general-ledger/statistical-account/136',
            reportType: 'cumulative',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'HRBN',
            name: 'Hours Billable Non Utilized',
            key: '122',
            href: '/objects/general-ledger/statistical-account/122',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'HRBU',
            name: 'Hours Billable Utilized',
            key: '123',
            href: '/objects/general-ledger/statistical-account/123',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'HRNN',
            name: 'Hours Non Billable Non Utilized',
            key: '124',
            href: '/objects/general-ledger/statistical-account/124',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'HRNU',
            name: 'Hours Non Billable Utilized',
            key: '125',
            href: '/objects/general-ledger/statistical-account/125',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'SHRS',
            name: 'Shares Outstanding',
            key: '138',
            href: '/objects/general-ledger/statistical-account/138',
            reportType: 'cumulative',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'SPCO',
            name: 'Salesperson Count',
            key: '137',
            href: '/objects/general-ledger/statistical-account/137',
            reportType: 'cumulative',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'SUBC',
            name: 'Subscribers - Canceled',
            key: '126',
            href: '/objects/general-ledger/statistical-account/126',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'SUBN',
            name: 'Subscribers - New',
            key: '127',
            href: '/objects/general-ledger/statistical-account/127',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
      {
        accounts: [
          {
            id: 'SUBT',
            name: 'Subscribers - Total',
            key: '128',
            href: '/objects/general-ledger/statistical-account/128',
            reportType: 'forPeriod',
          },
        ],
        dimensions: ['location'],
      },
    ],
    populateData: [
        {
          source: "actuals" as const,
        reportingPeriods: [
          {
            key: '407',
            id: '2025/01',
            href: '/objects/general-ledger/reporting-period/407',
          },
          {
            key: '408',
            id: '2025/02',
            href: '/objects/general-ledger/reporting-period/408',
          },
          {
            key: '425',
            id: '2025/03',
            href: '/objects/general-ledger/reporting-period/425',
          },
          {
            key: '429',
            id: '2025/04',
            href: '/objects/general-ledger/reporting-period/429',
          },
          {
            key: '421',
            id: '2025/05',
            href: '/objects/general-ledger/reporting-period/421',
          },
          {
            key: '428',
            id: '2025/06',
            href: '/objects/general-ledger/reporting-period/428',
          },
          {
            key: '423',
            id: '2025/07',
            href: '/objects/general-ledger/reporting-period/423',
          },
          {
            key: '427',
            id: '2025/08',
            href: '/objects/general-ledger/reporting-period/427',
          },
          {
            key: '420',
            id: '2025/09',
            href: '/objects/general-ledger/reporting-period/420',
          },
          {
            key: '426',
            id: '2025/10',
            href: '/objects/general-ledger/reporting-period/426',
          },
          {
            key: '424',
            id: '2025/11',
            href: '/objects/general-ledger/reporting-period/424',
          },
          {
            key: '422',
            id: '2025/12',
            href: '/objects/general-ledger/reporting-period/422',
          },
        ],
        periodsMap: {
          '407': '383',
          '408': '384',
          '420': '391',
          '421': '387',
          '422': '394',
          '423': '389',
          '424': '393',
          '425': '385',
          '426': '392',
          '427': '390',
          '428': '388',
          '429': '386',
        },
      },
    ],
    entitiesIds: ['100', '200', '300', '400', '500', '900', '910', '920'],
    dimensionFilters: {},
    workforce: {
      enabled: false,
    },
};
