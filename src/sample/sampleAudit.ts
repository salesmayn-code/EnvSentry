import type { AuditResult, Finding } from '../lib/types'

const findingRedisMissingProd: Finding = {
  type: 'missing',
  severity: 'critical',
  key: 'REDIS_URL',
  fileId: 'env-production',
  lines: [],
}

const findingSmtpEmptyStaging: Finding = {
  type: 'empty',
  severity: 'critical',
  key: 'SMTP_HOST',
  fileId: 'env-staging',
  lines: [3],
}

const findingSentryMissingTesting: Finding = {
  type: 'missing',
  severity: 'critical',
  key: 'SENTRY_DSN',
  fileId: 'env-testing',
  lines: [],
}

const findingLogDuplicateDev: Finding = {
  type: 'duplicate',
  severity: 'info',
  key: 'LOG_LEVEL',
  fileId: 'env-development',
  lines: [8, 14],
}

const findingDebugExtraDev: Finding = {
  type: 'extra',
  severity: 'info',
  key: 'DEBUG',
  fileId: 'env-development',
  lines: [15],
}

const findingDebugExtraStaging: Finding = {
  type: 'extra',
  severity: 'info',
  key: 'DEBUG',
  fileId: 'env-staging',
  lines: [9],
}

const findingLegacyExtraProd: Finding = {
  type: 'extra',
  severity: 'info',
  key: 'LEGACY_API_KEY',
  fileId: 'env-production',
  lines: [8],
}

const allFindings: Finding[] = [
  findingRedisMissingProd,
  findingSmtpEmptyStaging,
  findingSentryMissingTesting,
  findingLogDuplicateDev,
  findingDebugExtraDev,
  findingDebugExtraStaging,
  findingLegacyExtraProd,
]

export const sampleAudit: AuditResult = {
  referenceId: 'env-example',
  files: [
    {
      id: 'env-example',
      name: '.env.example',
      isReference: true,
      keyCount: 8,
      critical: 0,
      info: 0,
      invalidLines: [],
    },
    {
      id: 'env-development',
      name: '.env.development',
      isReference: false,
      keyCount: 9,
      critical: 0,
      info: 2,
      invalidLines: [],
    },
    {
      id: 'env-testing',
      name: '.env.testing',
      isReference: false,
      keyCount: 7,
      critical: 1,
      info: 0,
      invalidLines: [],
    },
    {
      id: 'env-staging',
      name: '.env.staging',
      isReference: false,
      keyCount: 9,
      critical: 1,
      info: 1,
      invalidLines: [],
    },
    {
      id: 'env-production',
      name: '.env.production',
      isReference: false,
      keyCount: 8,
      critical: 1,
      info: 1,
      invalidLines: [],
    },
  ],
  rows: [
    {
      key: 'DATABASE_URL',
      inReference: true,
      cells: {
        'env-example': { lines: [1], empty: false },
        'env-development': { lines: [1], empty: false },
        'env-testing': { lines: [1], empty: false },
        'env-staging': { lines: [1], empty: false },
        'env-production': { lines: [1], empty: false },
      },
      findings: [],
      status: 'ok',
    },
    {
      key: 'REDIS_URL',
      inReference: true,
      cells: {
        'env-example': { lines: [2], empty: false },
        'env-development': { lines: [2], empty: false },
        'env-testing': { lines: [2], empty: false },
        'env-staging': { lines: [2], empty: false },
        'env-production': { lines: [], empty: false },
      },
      findings: [findingRedisMissingProd],
      status: 'critical',
    },
    {
      key: 'SMTP_HOST',
      inReference: true,
      cells: {
        'env-example': { lines: [3], empty: false },
        'env-development': { lines: [3], empty: false },
        'env-testing': { lines: [3], empty: false },
        'env-staging': { lines: [3], empty: true },
        'env-production': { lines: [2], empty: false },
      },
      findings: [findingSmtpEmptyStaging],
      status: 'critical',
    },
    {
      key: 'SMTP_PORT',
      inReference: true,
      cells: {
        'env-example': { lines: [4], empty: false },
        'env-development': { lines: [4], empty: false },
        'env-testing': { lines: [4], empty: false },
        'env-staging': { lines: [4], empty: false },
        'env-production': { lines: [3], empty: false },
      },
      findings: [],
      status: 'ok',
    },
    {
      key: 'JWT_SECRET',
      inReference: true,
      cells: {
        'env-example': { lines: [5], empty: false },
        'env-development': { lines: [5], empty: false },
        'env-testing': { lines: [5], empty: false },
        'env-staging': { lines: [5], empty: false },
        'env-production': { lines: [4], empty: false },
      },
      findings: [],
      status: 'ok',
    },
    {
      key: 'API_BASE_URL',
      inReference: true,
      cells: {
        'env-example': { lines: [6], empty: false },
        'env-development': { lines: [6], empty: false },
        'env-testing': { lines: [6], empty: false },
        'env-staging': { lines: [6], empty: false },
        'env-production': { lines: [5], empty: false },
      },
      findings: [],
      status: 'ok',
    },
    {
      key: 'SENTRY_DSN',
      inReference: true,
      cells: {
        'env-example': { lines: [7], empty: true },
        'env-development': { lines: [7], empty: false },
        'env-testing': { lines: [], empty: false },
        'env-staging': { lines: [7], empty: false },
        'env-production': { lines: [6], empty: false },
      },
      findings: [findingSentryMissingTesting],
      status: 'critical',
    },
    {
      key: 'LOG_LEVEL',
      inReference: true,
      cells: {
        'env-example': { lines: [8], empty: false },
        'env-development': { lines: [8, 14], empty: false },
        'env-testing': { lines: [7], empty: false },
        'env-staging': { lines: [8], empty: false },
        'env-production': { lines: [7], empty: false },
      },
      findings: [findingLogDuplicateDev],
      status: 'info',
    },
    {
      key: 'DEBUG',
      inReference: false,
      cells: {
        'env-example': { lines: [], empty: false },
        'env-development': { lines: [15], empty: false },
        'env-testing': { lines: [], empty: false },
        'env-staging': { lines: [9], empty: false },
        'env-production': { lines: [], empty: false },
      },
      findings: [findingDebugExtraDev, findingDebugExtraStaging],
      status: 'info',
    },
    {
      key: 'LEGACY_API_KEY',
      inReference: false,
      cells: {
        'env-example': { lines: [], empty: false },
        'env-development': { lines: [], empty: false },
        'env-testing': { lines: [], empty: false },
        'env-staging': { lines: [], empty: false },
        'env-production': { lines: [8], empty: false },
      },
      findings: [findingLegacyExtraProd],
      status: 'info',
    },
  ],
  findings: allFindings,
  totals: {
    keys: 10,
    critical: 3,
    info: 4,
    byType: {
      missing: 2,
      extra: 3,
      empty: 1,
      duplicate: 1,
    },
  },
  generatedAt: '2026-11-14T11:00:00.000Z',
}
