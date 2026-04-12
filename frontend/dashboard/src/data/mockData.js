export const mockData = {
  dashboard: {
    stats: {
      sandboxes: 8,
      runtime: "25:52:21",
      agents: 5
    },
    recentTests: [
      {
        id: 1,
        agent: "agent1.hfosi.duofhdsfh.py",
        status: "Running",
        createdAt: "19/02/2026 19:20:00",
         runtime: "25:52:21"
      },
      {
        id: 2,
        agent: "agent1.hfosi.duofhdsfh.py",
        status: "Terminated",
        createdAt: "19/02/2026 19:20:00",
         runtime: "23:51:31"
      }
    ],
    storage: "34 GB",
    files: 24
  },

  testHistory: {
    tests: [
      {
        id: 1,
        agent: "agent1.hfosi.duofhdsfh.py",
        status: "Running",
        createdAt: "19/02/2026",
        runtime: "19:20:00"
      },
      {
        id: 2,
        agent: "agent1.hfosi.duofhdsfh.py",
        status: "Terminated",
        createdAt: "19/02/2026",
        runtime: "19:20:00"
      }
    ]
  },

  resourceUsage: {
    stats: [
      {
        title: "Memory Usage",
        value: "RAM: 180 MB"
      },
      {
        title: "Active Runtime",
        value: "21:21:51"
      },
      {
        title: "Tokens Used",
        value: "65% used"
      },
      {
        title: "GPU Usage",
        value: "25%"
      }
    ]
  },

  sandboxes: {
    stats: {
      created: 12,
      runtime: "21:21:51",
      storage: "24 GB"
    },
    history: [
      {
        id: 1,
        name: "sb_2344_bdhs.py",
        status: "Running",
        started: "12:21:02",
        duration: "03:23:02"
      },
      {
        id: 2,
        name: "sb_27_hjs.py",
        status: "Terminated",
        started: "12:51:02",
        duration: "3.1 Hr"
      }
    ]
  }
};