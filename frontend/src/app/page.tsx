'use client';

import { Button, Card, ThemeToggle, LanguageSelector } from '@/components';
import { useLanguage } from '@/hooks/useLanguage';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500" />
              <span className="text-xl font-bold">RescueNet</span>
            </div>
            
            <nav className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium hover:text-primary-600 transition-colors">
                {t('common.home')}
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary-600 transition-colors">
                {t('common.about')}
              </a>
              <a href="#" className="text-sm font-medium hover:text-primary-600 transition-colors">
                {t('common.contact')}
              </a>
            </nav>

            <div className="flex items-center gap-2">
              <LanguageSelector />
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 text-sm font-medium mb-6">
              ✨ {t('example.subtitle')}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              {t('example.title')}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t('example.description')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button variant="primary" size="lg">
                {t('common.login')}
              </Button>
              <Button variant="outline" size="lg">
                {t('common.register')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('example.features')}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build a modern, scalable application
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '⚡',
                title: t('example.feature1'),
                description: 'Built with the latest technologies for optimal performance',
              },
              {
                icon: '🌓',
                title: t('example.feature2'),
                description: 'Seamless theme switching with system preference detection',
              },
              {
                icon: '🌍',
                title: t('example.feature3'),
                description: 'Support for multiple languages out of the box',
              },
              {
                icon: '📦',
                title: t('example.feature4'),
                description: 'Role-based modules that are easy to extend',
              },
              {
                icon: '🎨',
                title: t('example.feature5'),
                description: 'Consistent styling with custom Tailwind configuration',
              },
              {
                icon: '📱',
                title: t('example.feature6'),
                description: 'Mobile-first design that works on all devices',
              },
            ].map((feature, index) => (
              <Card
                key={index}
                hoverable
                className="text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Example Roles Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Role-Based Modules
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Each role has its own feature module with consistent styling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              title={t('role.admin')}
              description="Full system control and management"
              hoverable
              footer={
                <Button variant="primary" className="w-full">
                  View Admin Dashboard
                </Button>
              }
            >
              <div className="flex items-center justify-center h-32 bg-primary-100 dark:bg-primary-900 rounded-lg mb-4">
                <span className="text-6xl">👨‍💼</span>
              </div>
            </Card>

            <Card
              title={t('role.user')}
              description="Personal dashboard and profile"
              hoverable
              footer={
                <Button variant="secondary" className="w-full">
                  View User Profile
                </Button>
              }
            >
              <div className="flex items-center justify-center h-32 bg-secondary-100 dark:bg-secondary-900 rounded-lg mb-4">
                <span className="text-6xl">👤</span>
              </div>
            </Card>

            <Card
              title={t('role.staff')}
              description="Task management and operations"
              hoverable
              footer={
                <Button variant="outline" className="w-full">
                  View Staff Tasks
                </Button>
              }
            >
              <div className="flex items-center justify-center h-32 bg-neutral-100 dark:bg-neutral-800 rounded-lg mb-4">
                <span className="text-6xl">👷</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500" />
              <span className="font-semibold">RescueNet</span>
            </div>
            
            <p className="text-sm text-muted-foreground">
              © 2025 RescueNet. Built with Next.js 15 + TypeScript + TailwindCSS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
