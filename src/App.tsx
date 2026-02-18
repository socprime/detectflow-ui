import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';

export const App: React.FC = () => {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="flex flex-1">
        <Outlet />
      </main>
    </div>
  );
};
