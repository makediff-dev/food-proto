'use client';

import {
  ArrowUpRight,
  BarChartSquare02,
  Bell01,
  CheckCircle,
  Copy01,
  CreditCard01,
  HomeLine,
  LogOut01,
  MarkerPin01,
  Menu01,
  MessageSquare01,
  Plus,
  TrendUp01,
} from '@untitledui/icons';
import type { ComponentType } from 'react';
import { useEffect, useId, useState } from 'react';

import styles from './feedback-prototype.module.css';
import { UIBadge, UIButton, UINavButton, UIStatCard, UITabs } from './feedback-ui';

type WorkspaceView = 'overview' | 'reviews' | 'locations' | 'telegram' | 'subscription';
type Rating = 'Плохо' | 'Нормально' | 'Хорошо';
type AuthStep = 'register' | 'company';
type TabletStep = 'rating' | 'comment' | 'thanks';

const reviews: ReadonlyArray<{
  rating: Rating;
  comment?: string;
  location: string;
  date: string;
}> = [
  {
    rating: 'Плохо',
    comment: 'Долго ждал заказ у стойки.',
    location: 'Кофейня на Центральной',
    date: 'Сегодня, 11:42',
  },
  { rating: 'Хорошо', comment: 'Спасибо за быстрый завтрак.', location: 'Кофейня у парка', date: 'Сегодня, 10:18' },
  { rating: 'Нормально', location: 'Кофейня на Центральной', date: 'Вчера, 18:06' },
  { rating: 'Хорошо', comment: 'Бариста помог выбрать зерно.', location: 'Кофейня у парка', date: 'Вчера, 14:31' },
];

const navItems: ReadonlyArray<{
  id: WorkspaceView;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { id: 'overview', label: 'Обзор', icon: HomeLine },
  { id: 'reviews', label: 'Отзывы', icon: MessageSquare01 },
  { id: 'locations', label: 'Точки и экраны', icon: MarkerPin01 },
  { id: 'telegram', label: 'Telegram', icon: Bell01 },
  { id: 'subscription', label: 'Подписка', icon: CreditCard01 },
];

function Mark() {
  return (
    <span className={styles.mark} aria-hidden="true">
      О
    </span>
  );
}

function ArrowIcon() {
  return <span aria-hidden="true">↗</span>;
}

const faqItems = [
  {
    question: 'Нужно ли покупать специальное оборудование?',
    answer:
      'Нет, экран работает в браузере на планшете. Поддерживаемые модели и требования к настройке устройства будут указаны после технического тестирования.',
  },
  {
    question: 'Можно ли использовать несколько планшетов в одном заведении?',
    answer:
      'Да. У торговой точки может быть несколько экранов с уникальными ссылками, а статистика объединяется на уровне заведения. Количество планшетов не формирует отдельную стоимость.',
  },
  {
    question: 'Что произойдёт, если отключится интернет?',
    answer:
      'Экран продолжит принимать оценки и сохранит фактическое время локально. После восстановления связи очередь отправится автоматически без дублирования.',
  },
  {
    question: 'Можно ли изменить оформление экрана?',
    answer:
      'Предусмотрены логотип, фон, основные цвета и иконки оценок. На каком уровне применяется оформление — компания, точка или экран — ещё согласовывается.',
  },
  {
    question: 'Как рассчитывается стоимость подписки?',
    answer:
      'Стоимость зависит от количества торговых точек. Цена за точку, скидки и точная формула пока не утверждены.',
  },
  {
    question: 'Что произойдёт после 7 дней бесплатного доступа?',
    answer:
      'Без оплаты доступ будет ограничен. Точный состав доступных экранов и действий после окончания периода требует согласования.',
  },
  {
    question: 'Можно ли отменить подписку?',
    answer:
      'Управление автопродлением предусмотрено. Точные сроки и последствия отмены будут зафиксированы вместе с правилами платёжного провайдера.',
  },
] as const;

function Landing({
  onRegister,
  onDemo,
  onTablet,
}: {
  onRegister: () => void;
  onDemo: () => void;
  onTablet: () => void;
}) {
  const [locations, setLocations] = useState(2);

  return (
    <main className={styles.landing}>
      <header className={styles.siteHeader}>
        <button
          type="button"
          className={styles.wordmark}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Mark />
          <span>Отклик</span>
        </button>
        <nav className={styles.siteNav} aria-label="Навигация по странице">
          <a href="#how">Как работает</a>
          <a href="#analytics">Аналитика</a>
          <a href="#price">Стоимость</a>
          <a href="#faq">Вопросы</a>
        </nav>
        <div className={styles.headerActions}>
          <button type="button" className={styles.textButton} onClick={onDemo}>
            Войти
          </button>
          <button type="button" className={styles.darkButton} onClick={onRegister}>
            Начать бесплатно <ArrowIcon />
          </button>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <h1>
            Узнайте о плохом опыте <em>до того, как он станет публичным</em>
          </h1>
          <p className={styles.heroLead}>
            Гость оставляет оценку на планшете в заведении. Вы видите статистику по точкам и получаете негатив в
            Telegram. Без приложения для посетителя.
          </p>
          <div className={styles.actionRow}>
            <button type="button" className={styles.darkButton} onClick={onRegister}>
              Начать бесплатно
            </button>
            <button type="button" className={styles.outlineButton} onClick={onDemo}>
              Открыть демо
            </button>
          </div>
          <p className={styles.microcopy}>7 дней бесплатно · карта не нужна</p>
        </div>

        <div className={styles.heroPreview}>
          <div className={styles.heroWindow}>
            <div className={styles.windowChrome}>
              <div className={styles.windowDots} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <p>Кофейня на Центральной · экран у кассы</p>
              <button type="button" onClick={onTablet}>
                Открыть сценарий
              </button>
            </div>
            <div className={styles.ratingQuestion}>Как прошло ваше посещение?</div>
            <div className={styles.ratingStrip}>
              {(['Плохо', 'Нормально', 'Хорошо'] as const).map((rating, index) => (
                <button type="button" key={rating} onClick={onTablet}>
                  <span className={styles.face} aria-hidden="true">
                    {index === 0 ? '⌢' : index === 1 ? '—' : '⌣'}
                  </span>
                  {rating}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.process} id="how">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Один короткий цикл</p>
          <h2>От кассы до решения — без длинных опросов.</h2>
        </div>
        <ol className={styles.steps}>
          <li>
            <span>01</span>
            <h3>Поставьте планшет</h3>
            <p>Откройте уникальную ссылку экрана в браузере точки.</p>
          </li>
          <li>
            <span>02</span>
            <h3>Собирайте оценки</h3>
            <p>Плохо, Нормально или Хорошо. Комментарий — по желанию.</p>
          </li>
          <li>
            <span>03</span>
            <h3>Замечайте изменения</h3>
            <p>Сравнивайте точки и получайте негативные отзывы в Telegram.</p>
          </li>
        </ol>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.benefitsIntro}>
          <h2>Обычный планшет становится точкой контакта</h2>
          <p>
            Не нужно специальное оборудование: экран открывается в браузере, несколько планшетов работают в одном
            заведении, а без сети оценки сохраняются на устройстве.
          </p>
        </div>
        <div className={styles.benefitStats}>
          <article>
            <strong>3</strong>
            <span>Понятные оценки на экране</span>
          </article>
          <article>
            <strong>1</strong>
            <span>Ссылка, чтобы запустить сбор</span>
          </article>
          <article>
            <strong>0</strong>
            <span>Приложений для посетителя</span>
          </article>
        </div>
      </section>

      <section className={styles.analyticsSection} id="analytics">
        <div className={styles.analyticsCopy}>
          <p className={styles.kicker}>Вся сеть в одном обзоре</p>
          <h2>Не средний балл, а понятная картина по каждой точке.</h2>
          <p>
            Смотрите количество и распределение оценок, динамику периода, комментарии и сравнение заведений. Формула
            удовлетворённости не показывается, пока она не согласована.
          </p>
          <button type="button" className={styles.outlineButton} onClick={onDemo}>
            Посмотреть кабинет <ArrowIcon />
          </button>
        </div>
        <figure className={styles.analyticsPreview}>
          <figcaption className={styles.srOnly}>Демонстрационный пример аналитики</figcaption>
          <div className={styles.previewTopline}>
            <span>Последние 7 дней</span>
            <strong>248 оценок</strong>
          </div>
          <div className={styles.previewBars}>
            <div>
              <span>Хорошо</span>
              <i style={{ '--landing-bar': '72%' } as React.CSSProperties} />
              <strong>72%</strong>
            </div>
            <div>
              <span>Нормально</span>
              <i style={{ '--landing-bar': '19%' } as React.CSSProperties} />
              <strong>19%</strong>
            </div>
            <div>
              <span>Плохо</span>
              <i style={{ '--landing-bar': '9%' } as React.CSSProperties} />
              <strong>9%</strong>
            </div>
          </div>
          <div className={styles.previewLocations}>
            <div>
              <span>Кофейня у парка</span>
              <strong>76% хорошо</strong>
            </div>
            <div>
              <span>Кофейня на Центральной</span>
              <strong>68% хорошо</strong>
            </div>
          </div>
          <small>Демонстрационные данные</small>
        </figure>
      </section>

      <section className={styles.reactionSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Быстрая реакция</p>
          <h2>Негатив не ждёт следующего отчёта.</h2>
        </div>
        <div className={styles.reactionFlow}>
          <div>
            <span className={styles.flowNumber}>1</span>
            <strong>Посетитель выбирает «Плохо»</strong>
            <p>Комментарий можно оставить, но он необязателен.</p>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <span className={styles.flowNumber}>2</span>
            <strong>Оценка попадает в кабинет</strong>
            <p>Она связана с торговой точкой и временем получения.</p>
          </div>
          <span aria-hidden="true">→</span>
          <div className={styles.telegramCard}>
            <span>Telegram · сейчас</span>
            <strong>Негативная оценка</strong>
            <p>Кофейня на Центральной</p>
            <blockquote>«Слишком долго ждал заказ»</blockquote>
          </div>
        </div>
        <p className={styles.neutralNote}>Точный состав Telegram-сообщения требует согласования.</p>
      </section>

      <section className={styles.customizationSection}>
        <div className={styles.customizationPreview}>
          <div className={styles.miniTablet}>
            <div>
              <Mark />
              <span>Название заведения</span>
            </div>
            <h3>Как прошло ваше посещение?</h3>
            <div>
              <span>⌢</span>
              <span>—</span>
              <span>⌣</span>
            </div>
          </div>
          <div className={styles.customizationControls}>
            <span>Предпросмотр оформления</span>
            <div>
              <i />
              <i />
              <i />
              <i />
            </div>
            <small>Логотип · фон · цвета · иконки</small>
          </div>
        </div>
        <div className={styles.customizationCopy}>
          <p className={styles.kicker}>Кастомизация экрана</p>
          <h2>Экран выглядит частью вашего заведения.</h2>
          <p>
            Загрузите логотип, настройте фон, основные цвета и иконки трёх оценок. Конструктор вопросов и сложных
            опросов в MVP не входит.
          </p>
          <div className={styles.neutralNote}>Уровень применения оформления пока не согласован.</div>
        </div>
      </section>

      <section className={styles.venuesSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Для офлайн-бизнеса</p>
          <h2>Один короткий вопрос — разные рабочие сценарии.</h2>
        </div>
        <div className={styles.venueGrid}>
          <article>
            <span>Кофейня</span>
            <h3>Узнать о задержке у стойки</h3>
            <p>Планшет рядом с выдачей помогает заметить проблему в момент посещения.</p>
          </article>
          <article>
            <span>Магазин</span>
            <h3>Сравнить опыт в филиалах</h3>
            <p>Оценки объединяются по торговым точкам и позволяют увидеть различия.</p>
          </article>
          <article>
            <span>Салон</span>
            <h3>Получить комментарий после услуги</h3>
            <p>Посетитель может добавить пояснение к одной из трёх оценок.</p>
          </article>
        </div>
      </section>

      <section className={styles.priceSection} id="price">
        <div className={styles.priceCopy}>
          <p className={styles.kicker}>Тариф зависит от точек</p>
          <h2>Платите за заведения, а не за планшеты.</h2>
          <p>
            Количество экранов внутри одной торговой точки не увеличивает стоимость. Фактическая цена за точку ещё
            согласовывается.
          </p>
        </div>
        <div className={styles.calculator}>
          <div className={styles.counterLabel}>
            <label htmlFor="landing-location-count">Торговых точек</label>
            <output htmlFor="landing-location-count">{locations}</output>
          </div>
          <input
            id="landing-location-count"
            type="range"
            min="1"
            max="10"
            value={locations}
            onChange={(event) => setLocations(Number(event.target.value))}
          />
          <div className={styles.calculatorResult}>
            <span>Расчёт за месяц</span>
            <strong>{locations} × цена точки</strong>
            <small>Цена и возможные скидки требуют согласования</small>
          </div>
          <button type="button" className={styles.darkButton} onClick={onRegister}>
            Начать пробный период <ArrowIcon />
          </button>
        </div>
      </section>

      <section className={styles.faqSection} id="faq">
        <div className={styles.faqIntro}>
          <p className={styles.kicker}>Практические вопросы</p>
          <h2>Что нужно знать перед запуском.</h2>
          <p>Ответы с открытыми условиями помечены прямо в тексте — без неподтверждённых обещаний.</p>
        </div>
        <div className={styles.faqList}>
          {faqItems.map((item, index) => (
            <details key={item.question}>
              <summary>
                <span>{String(index + 1).padStart(2, '0')}</span>
                {item.question}
                <i aria-hidden="true">＋</i>
              </summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.finalCta}>
        <p className={styles.kicker}>7 дней бесплатного доступа</p>
        <h2>Запустите первый экран и получите первую оценку.</h2>
        <p>Создайте аккаунт, добавьте точку и откройте ссылку на планшете.</p>
        <div className={styles.actionRow}>
          <button type="button" className={styles.darkButton} onClick={onRegister}>
            Начать бесплатно <ArrowIcon />
          </button>
          <button type="button" className={styles.outlineButton} onClick={onDemo}>
            Открыть демо
          </button>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerGrid}>
          <div className={styles.footerBrand}>
            <span className={styles.wordmark}>
              <Mark /> Отклик
            </span>
            <p>Платформа для сбора оценок посетителей в офлайн-заведениях.</p>
            <address>
              ООО «Отклик»
              <br />
              125009, Москва, ул. Тверская, 7, офис 412
              <br />
              ИНН 7708123456 · ОГРН 1237700123456
            </address>
          </div>
          <nav className={styles.footerColumn} aria-label="Продукт">
            <strong>Продукт</strong>
            <a href="#how">Как работает</a>
            <a href="#analytics">Аналитика</a>
            <a href="#price">Стоимость</a>
            <a href="#faq">Вопросы</a>
          </nav>
          <div className={styles.footerColumn}>
            <strong>Контакты</strong>
            <a href="mailto:hello@otklik.example">hello@otklik.example</a>
            <a href="tel:+74951234567">+7 495 123-45-67</a>
            <a href="https://t.me/otklik_support" rel="noreferrer">
              Telegram: @otklik_support
            </a>
            <span>Пн–пт, 10:00–19:00</span>
          </div>
          <div className={styles.footerColumn}>
            <strong>Документы</strong>
            <a href="#faq">Пользовательское соглашение</a>
            <a href="#faq">Политика конфиденциальности</a>
            <a href="#faq">Публичная оферта</a>
            <button type="button" className={styles.textButton} onClick={onDemo}>
              Войти в кабинет
            </button>
          </div>
        </div>
        <div className={styles.footerBar}>
          <p>© 2026 ООО «Отклик». Данные в футере демонстрационные.</p>
          <span>Юридические документы и реквизиты ещё не утверждены.</span>
        </div>
      </footer>
    </main>
  );
}

function AuthFlow({ onBack, onComplete }: { onBack: () => void; onComplete: () => void }) {
  const [step, setStep] = useState<AuthStep>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');

  function submitAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes('@')) {
      setError('Укажите email в формате name@example.ru');
      return;
    }
    if (!password) {
      setError('Введите пароль. Правила сложности ещё требуют согласования.');
      return;
    }
    setError('');
    setStep('company');
  }

  function submitCompany(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!company.trim()) {
      setError('Укажите название компании');
      return;
    }
    onComplete();
  }

  return (
    <main className={styles.authPage}>
      <header className={styles.authHeader}>
        <button type="button" className={styles.wordmark} onClick={onBack}>
          <Mark /> Отклик
        </button>
        <span>7 дней пробного периода</span>
      </header>
      <div className={styles.authGrid}>
        <aside>
          <p className={styles.kicker}>Самостоятельный запуск</p>
          <h1>{step === 'register' ? 'Создайте аккаунт владельца.' : 'Как называется ваша компания?'}</h1>
          <ol className={styles.authProgress}>
            <li data-active={step === 'register'}>1. Аккаунт</li>
            <li data-active={step === 'company'}>2. Компания</li>
            <li>3. Первая точка</li>
          </ol>
        </aside>
        <section className={styles.authFormWrap}>
          {step === 'register' ? (
            <form onSubmit={submitAccount} noValidate>
              <h2>Регистрация</h2>
              <label>
                Email
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-describedby={error ? 'auth-error' : undefined}
                />
              </label>
              <label>
                Пароль
                <input
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </label>
              {error ? (
                <p className={styles.formError} id="auth-error" role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" className={styles.darkButton}>
                Продолжить <ArrowIcon />
              </button>
              <button type="button" className={styles.textButton} onClick={onComplete}>
                Уже есть аккаунт? Войти в демо
              </button>
            </form>
          ) : (
            <form onSubmit={submitCompany}>
              <h2>Компания</h2>
              <label>
                Название компании
                <input value={company} onChange={(event) => setCompany(event.target.value)} />
              </label>
              <p className={styles.fieldNote}>Другие сведения о компании не добавлены: их состав ещё не согласован.</p>
              {error ? (
                <p className={styles.formError} role="alert">
                  {error}
                </p>
              ) : null}
              <button type="submit" className={styles.darkButton}>
                Создать компанию <ArrowIcon />
              </button>
              <button type="button" className={styles.textButton} onClick={() => setStep('register')}>
                Назад
              </button>
            </form>
          )}
        </section>
      </div>
    </main>
  );
}

function Workspace({
  onExit,
  onTablet,
  startOnboarding,
}: {
  onExit: () => void;
  onTablet: () => void;
  startOnboarding: boolean;
}) {
  const [view, setView] = useState<WorkspaceView>('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(startOnboarding);
  const [notice, setNotice] = useState(startOnboarding ? 'Компания создана. Осталось подключить первую точку.' : '');

  return (
    <main className={styles.workspace}>
      <button
        type="button"
        className={styles.mobileMenu}
        aria-expanded={mobileNav}
        aria-controls="feedback-sidebar"
        onClick={() => setMobileNav((value) => !value)}
      >
        <Menu01 aria-hidden="true" /> Меню
      </button>
      <aside id="feedback-sidebar" className={styles.sidebar} data-open={mobileNav}>
        <div className={styles.sidebarBrand}>
          <Mark /> <span>Отклик</span>
        </div>
        <nav aria-label="Личный кабинет">
          {navItems.map((item) => (
            <UINavButton
              key={item.id}
              current={view === item.id}
              label={item.label}
              icon={item.icon}
              onPress={() => {
                setView(item.id);
                setMobileNav(false);
              }}
            />
          ))}
        </nav>
        <div className={styles.trialBox}>
          <UIBadge tone="warning" dot>
            Пробный период
          </UIBadge>
          <strong>Осталось 6 дней</strong>
          <button type="button" onClick={() => setView('subscription')}>
            Выбрать подписку
          </button>
        </div>
        <button type="button" className={styles.companyButton} onClick={onExit}>
          <span className={styles.companyAvatar}>КС</span>
          <span className={styles.companyMeta}>
            <strong>Кофейни Север</strong>
            <small>Выйти из демо</small>
          </span>
          <LogOut01 aria-hidden="true" />
        </button>
      </aside>

      <section className={styles.workspaceMain}>
        <header className={styles.workspaceHeader}>
          <div>
            <span>Кофейни Север</span>
            <strong>{navItems.find((item) => item.id === view)?.label}</strong>
          </div>
          <UIBadge tone="neutral" dot>
            Демонстрационные данные
          </UIBadge>
        </header>
        {notice ? (
          <div className={styles.notice} role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')} aria-label="Закрыть сообщение">
              ×
            </button>
          </div>
        ) : null}

        {view === 'overview' ? <Overview onTablet={onTablet} /> : null}
        {view === 'reviews' ? <Reviews /> : null}
        {view === 'locations' ? (
          <Locations
            onTablet={onTablet}
            onNotice={setNotice}
            forceCreate={showOnboarding}
            onCreated={() => setShowOnboarding(false)}
          />
        ) : null}
        {view === 'telegram' ? <Telegram onNotice={setNotice} /> : null}
        {view === 'subscription' ? <Subscription onNotice={setNotice} /> : null}
      </section>

      {showOnboarding && view !== 'locations' ? (
        <div className={styles.onboardingBar}>
          <div>
            <strong>Следующий шаг: создайте первую точку</strong>
            <span>После этого вы получите ссылку для планшета.</span>
          </div>
          <UIButton
            color="secondary"
            iconLeading={Plus}
            iconTrailing={ArrowUpRight}
            onPress={() => setView('locations')}
          >
            Создать точку
          </UIButton>
        </div>
      ) : null}
    </main>
  );
}

function Overview({ onTablet }: { onTablet: () => void }) {
  const [period, setPeriod] = useState('7');

  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Состояние сети</p>
          <h1>Что говорят гости</h1>
        </div>
        <label className={styles.inlineSelect}>
          Период
          <select value={period} onChange={(event) => setPeriod(event.target.value)}>
            <option value="7">Последние 7 дней</option>
            <option value="30">Последние 30 дней</option>
          </select>
        </label>
      </div>

      <section className={styles.uiStatsGrid}>
        <UIStatCard
          label="Всего оценок"
          value={period === '7' ? '248' : '1 064'}
          detail="По двум торговым точкам"
          icon={BarChartSquare02}
        />
        <UIStatCard label="Хорошо" value="178" detail="72% оценок за период" icon={TrendUp01} />
        <UIStatCard label="Плохо" value="22" detail="9% оценок за период" icon={MessageSquare01} />
      </section>
      <div className={styles.metricNote}>
        <CheckCircle aria-hidden="true" />
        <div>
          <strong>Показатель удовлетворённости не рассчитан</strong>
          <span>Формула ещё не согласована — не подменяем её долей положительных оценок.</span>
        </div>
      </div>

      <div className={styles.dashboardGrid}>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>Точки</h2>
              <p>Сравнение за выбранный период</p>
            </div>
          </div>
          <div className={styles.locationCompare}>
            <div className={styles.compareHeader}>
              <span>Точка</span>
              <span>Хорошо</span>
              <span>Нормально</span>
              <span>Плохо</span>
            </div>
            <div>
              <strong>На Центральной</strong>
              <span>68%</span>
              <span>20%</span>
              <span>12%</span>
            </div>
            <div>
              <strong>У парка</strong>
              <span>76%</span>
              <span>18%</span>
              <span>6%</span>
            </div>
          </div>
        </section>
        <section className={styles.panel}>
          <div className={styles.panelHeading}>
            <div>
              <h2>Последние отзывы</h2>
              <p>Новые сверху</p>
            </div>
          </div>
          <div className={styles.compactReviews}>
            {reviews.slice(0, 3).map((review) => (
              <article key={`${review.location}-${review.date}`}>
                <RatingBadge rating={review.rating} />
                <div>
                  <strong>{review.comment ?? 'Без комментария'}</strong>
                  <span>
                    {review.location} · {review.date}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <button type="button" className={styles.tabletShortcut} onClick={onTablet}>
        <span>Проверить экран посетителя</span>
        <ArrowIcon />
      </button>
    </div>
  );
}

function RatingBadge({ rating }: { rating: Rating }) {
  const tone = rating === 'Плохо' ? 'error' : rating === 'Хорошо' ? 'success' : 'neutral';
  return (
    <UIBadge tone={tone} dot>
      {rating}
    </UIBadge>
  );
}

function Reviews() {
  const [filter, setFilter] = useState<'Все' | Rating>('Все');
  const visible = filter === 'Все' ? reviews : reviews.filter((review) => review.rating === filter);

  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Конкретный опыт</p>
          <h1>Отзывы</h1>
        </div>
      </div>
      <div className={styles.filterBar}>
        <UITabs
          items={['Все', 'Плохо', 'Нормально', 'Хорошо'] as const}
          selectedKey={filter}
          onSelectionChange={setFilter}
          ariaLabel="Фильтр по оценке"
        />
        <label>
          Точка
          <select>
            <option>Все точки</option>
            <option>Кофейня на Центральной</option>
            <option>Кофейня у парка</option>
          </select>
        </label>
      </div>
      <section className={styles.reviewList} aria-live="polite">
        {visible.map((review) => (
          <article key={`${review.location}-${review.date}`}>
            <RatingBadge rating={review.rating} />
            <div>
              {review.comment ? <p>«{review.comment}»</p> : <p className={styles.mutedText}>Комментарий не оставлен</p>}
              <span>{review.location}</span>
            </div>
            <time>{review.date}</time>
          </article>
        ))}
      </section>
    </div>
  );
}

function Locations({
  onTablet,
  onNotice,
  forceCreate,
  onCreated,
}: {
  onTablet: () => void;
  onNotice: (message: string) => void;
  forceCreate: boolean;
  onCreated: () => void;
}) {
  const dialogTitleId = useId();
  const [dialogOpen, setDialogOpen] = useState(forceCreate);
  const [name, setName] = useState('');

  useEffect(() => {
    if (forceCreate) setDialogOpen(true);
  }, [forceCreate]);

  function createLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;
    setDialogOpen(false);
    onCreated();
    onNotice(`Точка «${name.trim()}» создана. Экран готов к настройке.`);
    setName('');
  }

  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Единица подписки и аналитики</p>
          <h1>Точки и экраны</h1>
        </div>
        <UIButton iconLeading={Plus} onPress={() => setDialogOpen(true)}>
          Добавить точку
        </UIButton>
      </div>
      <section className={styles.locationList}>
        <article>
          <div className={styles.locationIndex}>01</div>
          <div>
            <h2>Кофейня на Центральной</h2>
            <p>2 экрана · статистика объединяется на уровне точки</p>
          </div>
          <div className={styles.screenLinks}>
            <button type="button" onClick={onTablet}>
              Экран у кассы <span>Активен</span>
            </button>
            <button type="button" onClick={onTablet}>
              Экран в зале <span>Активен</span>
            </button>
          </div>
          <UIButton
            color="secondary"
            size="sm"
            iconLeading={Copy01}
            onPress={() => onNotice('Ссылка экрана скопирована')}
          >
            Копировать ссылку
          </UIButton>
        </article>
        <article>
          <div className={styles.locationIndex}>02</div>
          <div>
            <h2>Кофейня у парка</h2>
            <p>1 экран · статистика объединяется на уровне точки</p>
          </div>
          <div className={styles.screenLinks}>
            <button type="button" onClick={onTablet}>
              Основной экран <span>Активен</span>
            </button>
          </div>
          <UIButton
            color="secondary"
            size="sm"
            iconLeading={Copy01}
            onPress={() => onNotice('Ссылка экрана скопирована')}
          >
            Копировать ссылку
          </UIButton>
        </article>
      </section>
      <div className={styles.scopeNote}>
        <strong>Требует решения</strong>
        <span>Уровень применения оформления — компания, точка или отдельный экран — ещё не согласован.</span>
      </div>

      {dialogOpen ? (
        <div className={styles.dialogBackdrop}>
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby={dialogTitleId}>
            <button
              type="button"
              className={styles.dialogClose}
              onClick={() => setDialogOpen(false)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <p className={styles.kicker}>Новая торговая точка</p>
            <h2 id={dialogTitleId}>Сначала — только название.</h2>
            <form onSubmit={createLocation}>
              <label>
                Название точки
                <input value={name} onChange={(event) => setName(event.target.value)} required />
              </label>
              <p className={styles.fieldNote}>
                Адрес и другие поля не добавлены: их необходимость ещё не подтверждена.
              </p>
              <UIButton type="submit" iconLeading={Plus} iconTrailing={ArrowUpRight}>
                Создать точку
              </UIButton>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function Telegram({ onNotice }: { onNotice: (message: string) => void }) {
  const [connected, setConnected] = useState(false);
  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Оперативное информирование</p>
          <h1>Telegram</h1>
        </div>
      </div>
      <section className={styles.integrationGrid}>
        <div className={styles.integrationCopy}>
          <h2>Негатив — сразу в рабочем чате.</h2>
          <p>Бот отправляет название точки, оценку «Плохо» и комментарий посетителя, если он есть.</p>
          <ol>
            <li>Откройте бота по защищённой ссылке.</li>
            <li>Выберите личный или групповой чат.</li>
            <li>Подтвердите получение уведомлений.</li>
          </ol>
          <UIButton
            iconLeading={Bell01}
            iconTrailing={ArrowUpRight}
            onPress={() => {
              setConnected(true);
              onNotice('Демо-подключение Telegram завершено');
            }}
          >
            {connected ? 'Telegram подключён' : 'Подключить Telegram'}
          </UIButton>
        </div>
        <div className={styles.telegramPreview}>
          <div className={styles.telegramTop}>
            <span>Отклик · уведомление</span>
            <time>11:42</time>
          </div>
          <strong>Негативная оценка</strong>
          <dl>
            <div>
              <dt>Торговая точка</dt>
              <dd>Кофейня на Центральной</dd>
            </div>
            <div>
              <dt>Оценка</dt>
              <dd>Плохо</dd>
            </div>
            <div>
              <dt>Комментарий</dt>
              <dd>Слишком долго ждал заказ</dd>
            </div>
          </dl>
          <small>Точный состав сообщения и маршрутизация по точкам требуют согласования.</small>
        </div>
      </section>
    </div>
  );
}

function Subscription({ onNotice }: { onNotice: (message: string) => void }) {
  const [locations, setLocations] = useState(2);
  const [renew, setRenew] = useState(true);
  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Управление доступом</p>
          <h1>Подписка</h1>
        </div>
      </div>
      <section className={styles.subscriptionGrid}>
        <div className={styles.currentPlan}>
          <span>Текущий статус</span>
          <h2>Пробный период</h2>
          <strong>6 дней осталось</strong>
          <dl>
            <div>
              <dt>Оплачиваемых точек</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>Следующее продление</dt>
              <dd>После выбора тарифа</dd>
            </div>
            <div>
              <dt>Платёжный способ</dt>
              <dd>Не добавлен</dd>
            </div>
          </dl>
        </div>
        <div className={styles.subscriptionCalc}>
          <h2>Количество точек</h2>
          <div className={styles.numberStepper}>
            <button
              type="button"
              onClick={() => setLocations((value) => Math.max(1, value - 1))}
              aria-label="Уменьшить"
            >
              −
            </button>
            <output>{locations}</output>
            <button type="button" onClick={() => setLocations((value) => value + 1)} aria-label="Увеличить">
              +
            </button>
          </div>
          <div className={styles.calculatorResult}>
            <span>Стоимость в месяц</span>
            <strong>{locations} × цена точки</strong>
            <small>Цена и правила перерасчёта требуют согласования</small>
          </div>
          <label className={styles.checkbox}>
            <input type="checkbox" checked={renew} onChange={(event) => setRenew(event.target.checked)} />
            Автоматическое продление
          </label>
          <UIButton
            iconLeading={CreditCard01}
            iconTrailing={ArrowUpRight}
            onPress={() => onNotice('Переход к платёжному провайдеру показан в демо')}
          >
            Перейти к оплате
          </UIButton>
          <p className={styles.fieldNote}>
            Провайдер оплаты ещё не выбран. Карточные данные в прототипе не запрашиваются.
          </p>
        </div>
      </section>
    </div>
  );
}

function Tablet({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<TabletStep>('rating');
  const [rating, setRating] = useState<Rating | null>(null);
  const [comment, setComment] = useState('');
  const [offline, setOffline] = useState(false);
  const [queued, setQueued] = useState(0);

  useEffect(() => {
    if (step !== 'thanks') return;
    const timer = window.setTimeout(() => {
      setStep('rating');
      setRating(null);
      setComment('');
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [step]);

  function chooseRating(value: Rating) {
    setRating(value);
    setStep('comment');
  }

  function submitRating() {
    if (offline) setQueued((value) => value + 1);
    setStep('thanks');
  }

  return (
    <main className={styles.tablet}>
      <header className={styles.tabletHeader}>
        <span className={styles.wordmark}>
          <Mark /> Кофейни Север
        </span>
        <div>
          <button
            type="button"
            className={styles.connectionToggle}
            aria-pressed={offline}
            onClick={() => setOffline((value) => !value)}
          >
            {offline ? `Нет сети · в очереди ${queued}` : 'Онлайн'}
          </button>
          <button type="button" className={styles.tabletClose} onClick={onClose} aria-label="Закрыть экран посетителя">
            ×
          </button>
        </div>
      </header>

      {step === 'rating' ? (
        <section className={styles.tabletRating}>
          <p>Текст вопроса требует согласования</p>
          <h1>Как прошло ваше посещение?</h1>
          <div className={styles.tabletChoices}>
            {(['Плохо', 'Нормально', 'Хорошо'] as const).map((value, index) => (
              <button type="button" key={value} onClick={() => chooseRating(value)}>
                <span aria-hidden="true">{index === 0 ? '⌢' : index === 1 ? '—' : '⌣'}</span>
                <strong>{value}</strong>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 'comment' ? (
        <section className={styles.tabletComment}>
          <RatingBadge rating={rating ?? 'Нормально'} />
          <h1>Хотите добавить комментарий?</h1>
          <p>Это необязательно</p>
          <label>
            <span className={styles.srOnly}>Комментарий</span>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Расскажите, что можно улучшить"
            />
          </label>
          <div className={styles.actionRow}>
            <button type="button" className={styles.outlineButton} onClick={() => setStep('rating')}>
              Назад
            </button>
            <button type="button" className={styles.darkButton} onClick={submitRating}>
              Отправить оценку <ArrowIcon />
            </button>
          </div>
          <small>Отдельный шаг комментария — решение прототипа, не утверждённое бизнес-правило.</small>
        </section>
      ) : null}

      {step === 'thanks' ? (
        <section className={styles.tabletThanks} role="status">
          <span aria-hidden="true">✓</span>
          <h1>{offline ? 'Оценка сохранена на этом устройстве.' : 'Спасибо. Оценка получена.'}</h1>
          <p>{offline ? 'Она отправится после восстановления связи.' : 'Экран скоро вернётся к началу.'}</p>
          <small>В прототипе возврат произойдёт через 12 секунд. Точный таймер требует согласования.</small>
          <button type="button" className={styles.textButton} onClick={() => setStep('rating')}>
            Вернуться сейчас
          </button>
        </section>
      ) : null}
    </main>
  );
}

export function FeedbackPrototype() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'workspace' | 'tablet'>('landing');
  const [fromRegistration, setFromRegistration] = useState(false);
  const [previousScreen, setPreviousScreen] = useState<'landing' | 'workspace'>('landing');

  function openTablet(from: 'landing' | 'workspace') {
    setPreviousScreen(from);
    setScreen('tablet');
  }

  if (screen === 'tablet') {
    return <Tablet onClose={() => setScreen(previousScreen)} />;
  }

  if (screen === 'auth') {
    return (
      <AuthFlow
        onBack={() => setScreen('landing')}
        onComplete={() => {
          setFromRegistration(true);
          setScreen('workspace');
        }}
      />
    );
  }

  if (screen === 'workspace') {
    return (
      <Workspace
        startOnboarding={fromRegistration}
        onExit={() => {
          setFromRegistration(false);
          setScreen('landing');
        }}
        onTablet={() => openTablet('workspace')}
      />
    );
  }

  return (
    <Landing
      onRegister={() => setScreen('auth')}
      onDemo={() => setScreen('workspace')}
      onTablet={() => openTablet('landing')}
    />
  );
}
