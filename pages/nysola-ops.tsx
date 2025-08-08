import { useEffect, useState } from 'react';
import FullLayout from '@/components/FullLayout';

const CHECKLIST_KEY = 'nysola-checklist';

type Step = {
  phase: string;
  steps: string[];
};

const data: Step[] = [
  {
    phase: 'PHASE 0: MENTALITAS CUAN GIGACHAD',
    steps: [
      'Gak ngemis task, tapi nyari pola',
      'Eksperimen terus: gagal = data buat AI',
      'Visi tajam → 1000 USD real → 200 juta IDR 2026',
      'Fokus & stamina kerja = senjata utama',
    ],
  },
  {
    phase: 'PHASE 1: CORE SYSTEM',
    steps: [
      'Firebase + wallet + TX log',
      'Auto Task TX testnet',
      'Dashboard analytics (chart, summary)',
      'Export JSON, toggle PK',
      'GOD EYE memory inject',
      'Evaluator, AutoTaskLogs, MissionProgress',
    ],
  },
  {
    phase: 'PHASE 2: CUAN DASAR (100% No Modal)',
    steps: [
      'Faucet hunter: isi auto dari situs faucet testnet',
      'Dummy TX tracker: farming TX count',
      'Airdrop testnet: Sepolia, Starknet, Scroll, Zeta',
      'Claim reward tracker → Wallet Hunter UI',
      'Cronjob schedule (cron-job.org / GitHub Actions)',
    ],
  },
  {
    phase: 'PHASE 3: STRATEGI CUAN TANPA MODAL (LEVEL LANJUT)',
    steps: [
      'Galxe auto quest + point farming',
      'Zealy daily mission hunter',
      'Zealy hidden XP exploit (engagement sniping)',
      'Guild XYZ sniper',
      'TaskOn AI Agent',
      'Crew3 / Layer3 farming tracker',
      'NFT mint gratis (free claim alert)',
    ],
  },
  {
    phase: 'PHASE 4: CUAN DARI AKTIVITAS JARINGAN',
    steps: [
      'LayerZero auto bridge (testnet & mainnet)',
      'Scroll / Base faucet + TX farming',
      'Starknet TX farming (0.005 ETH reward)',
      'Swap farming → detect volume & count',
      'DEX sniper TX (Meme coins early launch)',
      'Blast farming pasif (browser extension hunter)',
    ],
  },
  {
    phase: 'PHASE 5: REWARD AUTO TRACKER',
    steps: [
      'Reward masuk → auto notif',
      'Wallet rank → leaderboard',
      'Snapshot scanner (detect eligible wallet)',
      'Vesting reward checker (terdistribusi bertahap)',
      'Portfolio auto sync (Zerion API / Debank)',
    ],
  },
  {
    phase: 'PHASE 6: SUPER CUAN BOT MODE',
    steps: [
      'Telegram Hunter BOT: /hunt, /check, /wallets, /tx',
      'Auto withdraw reward ke wallet utama',
      'Gas price sniper → kirim pas murah',
      'Wallet health tracker (low balance = skip TX)',
    ],
  },
  {
    phase: 'PHASE 7: EXPLOIT STRATEGI',
    steps: [
      'Bug bounty sniper (Nuclei + GPT-4o)',
      'TX replay farming (di chain kecil)',
      'Invite + referral farming (tanpa spam)',
      'Event sniper (detect tweet → auto daftar)',
      'Wallet aging → farming akun tua',
    ],
  },
  {
    phase: 'PHASE 8: AUTO INVEST / FLIPPING',
    steps: [
      'AI NFT flip detector (mint → floor)',
      'Auto monitor DEX liquidity masuk',
      'Token vesting farming → jadi early',
      'L2 farming + gas refund exploit',
      'Multichain synergy farming (optimalkan overlap)',
    ],
  },
  {
    phase: 'PHASE 9: NEXT GEN AI OPS',
    steps: [
      'GOD EYE AGI: belajar dari log → pilih strategi paling cuan',
      'AI Selector → pilih chain + wallet paling profit',
      'Auto scaling wallet (generate wallet baru saat butuh)',
      'Burn wallet → jika blacklist / reward habis',
      'Memory inject + feedback + score history',
    ],
  },
  {
    phase: 'PHASE 10: SYSTEM INTEGRATION & SCALE-UP',
    steps: [
      'Webhook integrasi (tx trigger → Discord/Telegram)',
      'GitHub Actions → Auto deploy tools hunter',
      'Zapier / Make automation → third-party tasks',
      'Vercel Analytics, Monitor & Logging',
      'External RPC provider switcher',
      'Sentry / Posthog / LogSnag monitoring',
      'NFT / Reward webhook listener',
      'Custom Admin Panel Integration',
    ],
  },
];

export default function NysolaOps() {
  const [checked, setChecked] = useState<boolean[][]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CHECKLIST_KEY);
    if (saved) setChecked(JSON.parse(saved));
    else setChecked(data.map((d) => d.steps.map(() => false)));
  }, []);

  const toggle = (phaseIdx: number, stepIdx: number) => {
    const updated = [...checked];
    updated[phaseIdx][stepIdx] = !updated[phaseIdx][stepIdx];
    setChecked(updated);
    localStorage.setItem(CHECKLIST_KEY, JSON.stringify(updated));
  };

  return (
    <FullLayout title="Nysola Ops">
      <h1 className="text-3xl font-bold text-cyan text-center mb-10">🧭 Nysola Ops</h1>
      <div className="space-y-10">
        {data.map((phase, phaseIdx) => (
          <div
            key={phase.phase}
            className="bg-black/40 backdrop-blur-md p-6 rounded-xl border border-violet-500 shadow-lg"
          >
            <h2 className="text-xl font-bold text-orchid mb-4">{phase.phase}</h2>
            <ul className="space-y-2">
              {phase.steps.map((step, stepIdx) => (
                <li key={stepIdx} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={checked[phaseIdx]?.[stepIdx] || false}
                    onChange={() => toggle(phaseIdx, stepIdx)}
                    className="w-4 h-4 accent-cyan-400"
                  />
                  <span className="text-white">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </FullLayout>
  );
}