'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  ShieldAlert, 
  WifiOff, 
  Layers,
  X
} from 'lucide-react';

export interface ErrorExplanation {
  badge: string;
  title: string;
  explanation: string;
  suggestion: string;
  isFirebase?: boolean;
}

/**
 * Translates complex technical or Firebase errors into plain, calm, human-friendly explanations.
 */
export function explainError(error: any): ErrorExplanation {
  if (!error) {
    return {
      badge: 'Notice',
      title: 'Temporary Hiccup',
      explanation: 'An unexpected issue occurred while processing this request. The rest of the store remains fully active and your cart is completely safe.',
      suggestion: 'Try reloading the section or return to the main store page.',
    };
  }

  const msg = typeof error === 'string' ? error : (error.message || error.toString?.() || '');
  const name = error.name || '';
  const code = error.code || '';

  // Firebase Permission Denied
  if (
    msg.includes('permission') || 
    msg.includes('insufficient permissions') || 
    code.includes('permission-denied') ||
    name === 'FirestorePermissionError' ||
    name === 'FirebaseError' && msg.includes('denied')
  ) {
    return {
      badge: 'Database Permission',
      title: 'Access Restricted or Session Expired',
      explanation: 'This database resource requires specific authorization. If you are accessing an administrative section or private customer orders, please ensure you are logged in with the correct account.',
      suggestion: 'Verify your login status or contact Vivaan Farms support if you believe this is an error.',
      isFirebase: true,
    };
  }

  // Firebase Quota or Resource Exhausted
  if (msg.includes('resource-exhausted') || msg.includes('quota')) {
    return {
      badge: 'Service Limit',
      title: 'High Traffic Detected',
      explanation: 'Our cloud database is experiencing unusually high demand at this moment. The system has paused live sync momentarily to protect your data.',
      suggestion: 'Please wait a moment and try refreshing the page.',
      isFirebase: true,
    };
  }

  // Network or Offline
  if (
    msg.includes('Failed to fetch') || 
    msg.includes('NetworkError') || 
    msg.includes('unavailable') || 
    code.includes('unavailable') ||
    !navigator.onLine
  ) {
    return {
      badge: 'Connection Alert',
      title: 'Network Connection Issue',
      explanation: 'We could not communicate with the cloud servers. This usually happens if your internet connection is momentarily unstable.',
      suggestion: 'Check your internet connection and click "Try Again".',
      isFirebase: true,
    };
  }

  // Missing memoization in useCollection/useDoc
  if (msg.includes('was not properly memoized') || msg.includes('useMemoFirebase')) {
    return {
      badge: 'Query Optimization',
      title: 'Database Query Notice',
      explanation: 'A database query connection was requested without a stabilized reference. We kept the page running safely.',
      suggestion: 'Click "Try Again" to re-establish the connection.',
      isFirebase: true,
    };
  }

  // Chunk loading error / new deployment
  if (msg.includes('Loading chunk') || msg.includes('ChunkLoadError')) {
    return {
      badge: 'Store Updated',
      title: 'New Store Update Available',
      explanation: 'A fresh update of Vivaan Farms was just deployed. Your browser has an older cached version of this page.',
      suggestion: 'Please reload the page to load the latest high-speed assets.',
    };
  }

  // Generic fallback
  return {
    badge: 'Application Notice',
    title: 'Unable to Load This Section',
    explanation: msg.length > 0 && msg.length < 180 
      ? msg 
      : 'A temporary problem prevented this section from displaying properly. All other parts of the website remain operational.',
    suggestion: 'Click "Try Again" below to reload this section, or navigate to another page.',
  };
}

export interface ErrorCardProps {
  /** Optional custom title. If omitted, deduced from error */
  title?: string;
  /** Optional custom message/explanation */
  message?: string;
  /** The error object itself */
  error?: any;
  /** Callback to retry or reset state */
  reset?: () => void;
  /** Show link back to home page */
  showHome?: boolean;
  /** Compact mode suitable for small widgets/cards */
  compact?: boolean;
  /** Dismiss callback if card is dismissible */
  onDismiss?: () => void;
  /** Custom extra actions */
  extraActions?: React.ReactNode;
  /** Class name overrides */
  className?: string;
}

export function ErrorCard({
  title,
  message,
  error,
  reset,
  showHome = true,
  compact = false,
  onDismiss,
  extraActions,
  className = '',
}: ErrorCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const info = explainError(error);
  const displayTitle = title || info.title;
  const displayExplanation = message || info.explanation;

  const rawDetails = error 
    ? typeof error === 'object' 
      ? (error.stack || error.message || JSON.stringify(error, null, 2))
      : String(error)
    : '';

  const handleCopy = () => {
    if (rawDetails) {
      navigator.clipboard.writeText(rawDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const IconComponent = info.isFirebase 
    ? ShieldAlert 
    : info.badge.includes('Connection') 
    ? WifiOff 
    : AlertTriangle;

  if (compact) {
    return (
      <div className={`p-4 rounded-xl border border-amber-200/80 bg-[#FFFDF9] shadow-sm text-left ${className}`}>
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-100/70 text-amber-800 shrink-0">
            <IconComponent className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                {info.badge}
              </span>
              <h4 className="text-xs font-bold text-gray-900 truncate">{displayTitle}</h4>
            </div>
            <p className="text-xs text-gray-600 line-clamp-2 mb-2">{displayExplanation}</p>
            <div className="flex items-center gap-2">
              {reset && (
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md bg-[#1B5E3B] text-white hover:bg-[#14482D] transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </button>
              )}
              {onDismiss && (
                <button
                  type="button"
                  onClick={onDismiss}
                  className="px-2 py-1 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                  Dismiss
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-xl mx-auto my-6 bg-[#FCFBF7] border border-[#E8DFD0] rounded-2xl shadow-sm overflow-hidden text-left transition-all ${className}`}>
      {/* Card Header with Warm Accent */}
      <div className="px-6 py-4 bg-gradient-to-r from-[#F5EFE1] to-[#F9F6EF] border-b border-[#E8DFD0] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-800">
            <IconComponent className="w-4 h-4" />
          </div>
          <div>
            <span className="inline-block text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200/60">
              {info.badge}
            </span>
          </div>
        </div>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error card"
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Card Body */}
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 font-headline mb-2">
          {displayTitle}
        </h3>
        <p className="text-sm text-[#5B4E38] leading-relaxed mb-4">
          {displayExplanation}
        </p>

        {info.suggestion && (
          <div className="p-3 mb-5 rounded-xl bg-amber-50/60 border border-amber-200/50 text-xs text-[#6B5A3D] flex items-start gap-2">
            <span className="font-bold text-amber-900 shrink-0">Tip:</span>
            <span>{info.suggestion}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#1B5E3B] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#14482D] transition-all shadow-sm cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}

          {showHome && (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white text-[#1B5E3B] border border-[#1B5E3B]/30 text-xs font-bold uppercase tracking-wider hover:bg-[#1B5E3B]/5 transition-all shadow-sm"
            >
              <Home className="w-3.5 h-3.5" />
              Return Home
            </Link>
          )}

          {extraActions}

          {rawDetails && (
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="ml-auto inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors cursor-pointer py-1"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{showDetails ? 'Hide Details' : 'Details'}</span>
              {showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}
        </div>

        {/* Expandable Technical Details Drawer */}
        {showDetails && rawDetails && (
          <div className="mt-4 pt-4 border-t border-gray-100 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-mono font-semibold text-gray-500">Diagnostic Details</span>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-gray-900 text-gray-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-48 whitespace-pre-wrap leading-tight border border-gray-800">
              {rawDetails}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
