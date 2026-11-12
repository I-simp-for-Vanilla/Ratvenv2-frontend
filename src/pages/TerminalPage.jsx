import PageHeader from '../components/ui/PageHeader';
import Terminal from '../components/terminal/Terminal';

/** Page plein écran : le terminal fixe de l'overlay n'y est pas affiché. */
export default function TerminalPage() {
  return (
    <div className="page-fill" style={{ paddingBottom: 24 }}>
      <PageHeader icon="terminal" title="Terminal" />
      <div className="term-page"><Terminal /></div>
    </div>
  );
}
