import { ContentForm } from '@/components/content-form';

export default function Home() {
  return (
    <main className="container mx-auto py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">write more good</h1>
        <ContentForm />
      </div>
    </main>
  );
}
