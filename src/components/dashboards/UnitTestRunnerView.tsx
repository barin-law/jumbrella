import React, { useState } from 'react';
import { Play, CheckCircle2, XCircle, RotateCcw, ShieldCheck, Terminal, Clock } from 'lucide-react';
import { COMPREHENSIVE_UNIT_TESTS } from '../../data/unitTests';
import { UnitTestCase } from '../../types';

export const UnitTestRunnerView: React.FC = () => {
  const [tests, setTests] = useState<UnitTestCase[]>(COMPREHENSIVE_UNIT_TESTS);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunTimestamp, setLastRunTimestamp] = useState<string | null>(null);

  const runAllTests = async () => {
    setIsRunning(true);
    const updated = [...tests];

    for (let i = 0; i < updated.length; i++) {
      const test = updated[i];
      const start = performance.now();
      try {
        const result = await test.run();
        const duration = Math.round(performance.now() - start);
        updated[i] = {
          ...test,
          status: result.passed ? 'PASSED' : 'FAILED',
          durationMs: duration,
          assertionMessage: result.message,
        };
      } catch (err: unknown) {
        const duration = Math.round(performance.now() - start);
        const errorMessage = err instanceof Error ? err.message : 'Unknown execution exception';
        updated[i] = {
          ...test,
          status: 'FAILED',
          durationMs: duration,
          assertionMessage: `Execution error: ${errorMessage}`,
        };
      }
      setTests([...updated]);
    }

    setLastRunTimestamp(new Date().toLocaleTimeString());
    setIsRunning(false);
  };

  const resetTests = () => {
    setTests(COMPREHENSIVE_UNIT_TESTS.map((t) => ({ ...t, status: 'PENDING', durationMs: undefined, assertionMessage: undefined })));
    setLastRunTimestamp(null);
  };

  const passedCount = tests.filter((t) => t.status === 'PASSED').length;
  const failedCount = tests.filter((t) => t.status === 'FAILED').length;
  const totalDuration = tests.reduce((acc, t) => acc + (t.durationMs || 0), 0);

  // Group tests by suite
  const suites = Array.from(new Set(tests.map((t) => t.suite)));

  return (
    <div id="unit-test-runner-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-black/15 pb-5 dark:border-white/15">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">Automated Test Suite & CI/CD Runner</h2>
            <span className="border border-black px-2 py-0.5 text-[10px] font-mono font-bold uppercase dark:border-white">
              Vitest / SubtleCrypto Engine
            </span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
            Cryptographic, authorization, state-machine, and compliance invariant regression tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 border border-black px-3 py-1.5 text-xs font-semibold hover:bg-neutral-100 dark:border-white dark:hover:bg-neutral-900"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset State
          </button>
          <button
            id="btn-run-unit-tests"
            onClick={runAllTests}
            disabled={isRunning}
            className="flex items-center gap-2 border border-black bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-neutral-800 dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          >
            <Play className="h-3.5 w-3.5" />
            {isRunning ? 'Executing Test Invariants...' : 'Run All Unit Tests'}
          </button>
        </div>
      </div>

      {/* Test Execution Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Total Invariant Tests
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">{tests.length}</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Automated coverage</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Passed Assertions
          </p>
          <p className="text-2xl font-bold mt-1 font-mono text-green-700 dark:text-green-400">
            {passedCount}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Zero regression failures</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Failed Invariants
          </p>
          <p className="text-2xl font-bold mt-1 font-mono text-red-600 dark:text-red-400">
            {failedCount}
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">Strict fail-closed safety</p>
        </div>

        <div className="border border-black/15 p-4 bg-white dark:border-white/15 dark:bg-black">
          <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
            Cumulative Runtime
          </p>
          <p className="text-2xl font-bold mt-1 font-mono">{totalDuration} ms</p>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            {lastRunTimestamp ? `Completed at ${lastRunTimestamp}` : 'Pending execution'}
          </p>
        </div>
      </div>

      {/* Detailed Test Suites Display */}
      <div className="space-y-6">
        {suites.map((suiteName) => {
          const suiteTests = tests.filter((t) => t.suite === suiteName);
          return (
            <div
              key={suiteName}
              className="border border-black/15 bg-white dark:border-white/15 dark:bg-black"
            >
              <div className="border-b border-black/10 px-5 py-3 bg-neutral-50 dark:border-white/10 dark:bg-neutral-900 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider">{suiteName}</span>
                <span className="text-[11px] font-mono text-neutral-500">
                  {suiteTests.length} tests in suite
                </span>
              </div>

              <div className="divide-y divide-black/10 dark:divide-white/10">
                {suiteTests.map((t) => (
                  <div key={t.id} className="p-4 space-y-2 hover:bg-neutral-50/60 dark:hover:bg-neutral-900/60 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold">{t.id}:</span>
                          <span className="text-xs font-bold text-black dark:text-white">
                            {t.name}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {t.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {t.durationMs !== undefined && (
                          <span className="text-[10px] font-mono text-neutral-500 flex items-center gap-0.5">
                            <Clock className="h-3 w-3" />
                            {t.durationMs}ms
                          </span>
                        )}
                        <span
                          className={`border px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                            t.status === 'PASSED'
                              ? 'border-green-600 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-300'
                              : t.status === 'FAILED'
                              ? 'border-red-600 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                              : 'border-black/30 text-neutral-500 dark:border-white/30'
                          }`}
                        >
                          {t.status}
                        </span>
                      </div>
                    </div>

                    {t.assertionMessage && (
                      <div className="border border-black/10 bg-neutral-50 p-2 text-[11px] font-mono text-neutral-700 dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-300">
                        {t.assertionMessage}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
