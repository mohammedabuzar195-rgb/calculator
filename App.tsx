
import React, { useState, useCallback, useEffect } from 'react';
import CalcButton from './components/CalcButton';
import { CalcState, Operator } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<CalcState>({
    currentValue: '0',
    previousValue: '',
    operator: null,
    overwrite: false,
    history: '',
    error: null,
  });

  const clear = () => {
    setState({
      currentValue: '0',
      previousValue: '',
      operator: null,
      overwrite: false,
      history: '',
      error: null,
    });
  };

  const deleteDigit = () => {
    if (state.error) return clear();
    if (state.overwrite) {
      setState(prev => ({ ...prev, currentValue: '0', overwrite: false }));
      return;
    }
    if (state.currentValue === '0') return;
    if (state.currentValue.length === 1) {
      setState(prev => ({ ...prev, currentValue: '0' }));
    } else {
      setState(prev => ({ ...prev, currentValue: prev.currentValue.slice(0, -1) }));
    }
  };

  const appendDigit = (digit: string) => {
    if (state.error) return;
    setState(prev => {
      if (prev.overwrite) {
        return { ...prev, currentValue: digit, overwrite: false };
      }
      if (digit === '0' && prev.currentValue === '0') return prev;
      if (digit === '.' && prev.currentValue.includes('.')) return prev;
      if (prev.currentValue === '0' && digit !== '.') {
        return { ...prev, currentValue: digit };
      }
      return { ...prev, currentValue: prev.currentValue + digit };
    });
  };

  const chooseOperator = (op: Operator) => {
    if (state.error) return;
    if (state.currentValue === '0' && state.previousValue === '') return;

    setState(prev => {
      if (prev.previousValue === '') {
        return {
          ...prev,
          operator: op,
          previousValue: prev.currentValue,
          currentValue: '0',
          history: `${prev.currentValue} ${op}`,
        };
      }

      if (prev.operator && !prev.overwrite) {
        const result = evaluate(prev);
        if (typeof result === 'string') {
          return { ...prev, error: result, currentValue: '0' };
        }
        return {
          ...prev,
          operator: op,
          previousValue: result.toString(),
          currentValue: '0',
          history: `${result} ${op}`,
        };
      }

      return { ...prev, operator: op, history: `${prev.previousValue} ${op}` };
    });
  };

  const evaluate = (s: CalcState): number | string => {
    const prev = parseFloat(s.previousValue);
    const current = parseFloat(s.currentValue);
    if (isNaN(prev) || isNaN(current)) return current;

    let computation: number = 0;
    switch (s.operator) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '*':
        computation = prev * current;
        break;
      case '/':
        if (current === 0) return "Cannot divide by zero";
        computation = prev / current;
        break;
      default:
        return current;
    }
    // Limit decimals to 8 to avoid overflow
    return parseFloat(computation.toFixed(8));
  };

  const computeResult = () => {
    if (state.operator == null || state.previousValue === '' || state.overwrite) return;
    
    const result = evaluate(state);
    if (typeof result === 'string') {
      setState(prev => ({ ...prev, error: result, currentValue: '0', history: '' }));
    } else {
      setState(prev => ({
        ...prev,
        overwrite: true,
        operator: null,
        previousValue: '',
        currentValue: result.toString(),
        history: `${prev.previousValue} ${prev.operator} ${prev.currentValue} =`,
      }));
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') appendDigit(e.key);
      if (e.key === '.') appendDigit('.');
      if (e.key === 'Escape') clear();
      if (e.key === 'Backspace') deleteDigit();
      if (e.key === 'Enter' || e.key === '=') computeResult();
      if (e.key === '+') chooseOperator('+');
      if (e.key === '-') chooseOperator('-');
      if (e.key === '*') chooseOperator('*');
      if (e.key === '/') chooseOperator('/');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  return (
    <div className="w-full max-w-md p-6">
      <div className="glass rounded-[2.5rem] p-6 flex flex-col gap-6">
        {/* Header/Title */}
        <div className="flex justify-between items-center px-2">
          <span className="text-white/40 text-sm font-semibold tracking-widest uppercase">Calculator</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
          </div>
        </div>

        {/* Display Screen */}
        <div className="bg-black/20 rounded-3xl p-6 min-h-[140px] flex flex-col justify-end items-end gap-1 overflow-hidden">
          <div className="text-indigo-300/60 text-sm font-medium h-6 truncate max-w-full">
            {state.history}
          </div>
          <div className={`w-full text-right font-light transition-all duration-200 break-all leading-tight ${state.error ? 'text-rose-400 text-2xl' : 'text-white text-5xl md:text-6xl'}`}>
            {state.error || state.currentValue}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-3 md:gap-4">
          <CalcButton label="AC" variant="action" onClick={clear} />
          <div className="invisible col-span-1"></div>
          <CalcButton label="⌫" variant="operator" onClick={deleteDigit} />
          <CalcButton label="÷" variant="operator" onClick={() => chooseOperator('/')} />

          <CalcButton label="7" onClick={() => appendDigit('7')} />
          <CalcButton label="8" onClick={() => appendDigit('8')} />
          <CalcButton label="9" onClick={() => appendDigit('9')} />
          <CalcButton label="×" variant="operator" onClick={() => chooseOperator('*')} />

          <CalcButton label="4" onClick={() => appendDigit('4')} />
          <CalcButton label="5" onClick={() => appendDigit('5')} />
          <CalcButton label="6" onClick={() => appendDigit('6')} />
          <CalcButton label="−" variant="operator" onClick={() => chooseOperator('-')} />

          <CalcButton label="1" onClick={() => appendDigit('1')} />
          <CalcButton label="2" onClick={() => appendDigit('2')} />
          <CalcButton label="3" onClick={() => appendDigit('3')} />
          <CalcButton label="+" variant="operator" onClick={() => chooseOperator('+')} />

          <CalcButton label="0" onClick={() => appendDigit('0')} spanTwo />
          <CalcButton label="." onClick={() => appendDigit('.')} />
          <CalcButton label="=" variant="equal" onClick={computeResult} />
        </div>
      </div>
      
      {/* Footer Instructions */}
      <p className="text-white/20 text-center mt-8 text-xs font-medium uppercase tracking-widest">
        Full Keyboard Support Enabled
      </p>
    </div>
  );
};

export default App;
