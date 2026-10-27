'use client';

import {
  AlertCircle,
  ArrowUpRight,
  BarChartSquare02,
  Bell01,
  CheckCircle,
  Copy01,
  CreditCard01,
  DotsHorizontal,
  Edit01,
  HomeLine,
  LogOut01,
  MarkerPin01,
  Menu01,
  MessageSquare01,
  Plus,
  Settings01,
  TrendUp01,
} from '@untitledui/icons';
import type { ComponentType } from 'react';
import { useEffect, useId, useState } from 'react';
import { Button as AriaButton, Menu, MenuItem, MenuTrigger, Popover } from 'react-aria-components';

import styles from './feedback-prototype.module.css';
import { UIBadge, UIButton, UINavButton, UIStatCard, UITabs } from './feedback-ui';

type WorkspaceView = 'overview' | 'reviews' | 'locations' | 'telegram' | 'subscription';
type Rating = 'Плохо' | 'Нормально' | 'Хорошо';
type AuthStep = 'register' | 'company';
type TabletStep = 'rating' | 'comment' | 'thanks';
type CabinetScene = 'filled' | 'loading' | 'emptyPeriod' | 'noLocations' | 'error' | 'restricted';
type SubscriptionStatus = 'trial' | 'trialEnding' | 'paid' | 'paymentError' | 'renewOff' | 'expired';

const reviews: ReadonlyArray<{
  rating: Rating;
  comment?: string;
  location: string;
  date: string;
  period: '7' | '30';
}> = [
  {
    rating: 'Плохо',
    comment: 'Долго ждал заказ у стойки.',
    location: 'Кофейня на Центральной',
    date: 'Сегодня, 11:42',
    period: '7',
  },
  {
    rating: 'Хорошо',
    comment: 'Спасибо за быстрый завтрак.',
    location: 'Кофейня у парка',
    date: 'Сегодня, 10:18',
    period: '7',
  },
  { rating: 'Нормально', location: 'Кофейня на Центральной', date: 'Вчера, 18:06', period: '7' },
  {
    rating: 'Хорошо',
    comment: 'Бариста помог выбрать зерно.',
    location: 'Кофейня у парка',
    date: 'Вчера, 14:31',
    period: '7',
  },
  {
    rating: 'Плохо',
    comment: 'Холодный кофе на вынос.',
    location: 'Кофейня на Центральной',
    date: '12 дней назад',
    period: '30',
  },
  {
    rating: 'Нормально',
    comment: 'Очередь чуть длиннее обычного.',
    location: 'Кофейня у парка',
    date: '3 недели назад',
    period: '30',
  },
];

const initialLocations = [
  {
    id: 'central',
    name: 'Кофейня на Центральной',
    counts: { '7': 126, '30': 540 },
    share: { good: '68%', ok: '20%', bad: '12%' },
    screens: [
      { id: 'cash', name: 'Экран у кассы', active: true },
      { id: 'hall', name: 'Экран в зале', active: true },
    ],
  },
  {
    id: 'park',
    name: 'Кофейня у парка',
    counts: { '7': 122, '30': 524 },
    share: { good: '76%', ok: '18%', bad: '6%' },
    screens: [{ id: 'main', name: 'Основной экран', active: true }],
  },
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
          <h1>Собирайте отзывы клиентов прямо в вашем заведении</h1>
          <p className={styles.heroLead}>
            Посетители оценивают обслуживание на планшете за несколько секунд. Вы отслеживаете отзывы и статистику по
            торговым точкам и получаете уведомления о негативных оценках в Telegram.
          </p>
          <div className={styles.actionRow}>
            <button type="button" className={styles.darkButton} onClick={onRegister}>
              Начать бесплатно
            </button>
            <button type="button" className={styles.outlineButton} onClick={onDemo}>
              Посмотреть демо
            </button>
          </div>
          <p className={styles.microcopy}>7 дней бесплатного доступа</p>
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
          <p className={styles.kicker}>Всего три шага</p>
          <h2>От оценки посетителя до понятной картины обслуживания</h2>
        </div>
        <ol className={styles.steps}>
          <li>
            <span>01</span>
            <h3>Подключите планшет</h3>
            <p>
              Создайте торговую точку и откройте уникальную ссылку на планшете. Устанавливать отдельное приложение не
              нужно.
            </p>
          </li>
          <li>
            <span>02</span>
            <h3>Собирайте отзывы</h3>
            <p>
              Посетители выбирают одну из трёх оценок: «Плохо», «Нормально» или «Хорошо». При желании оставляют
              комментарий.
            </p>
          </li>
          <li>
            <span>03</span>
            <h3>Анализируйте результаты</h3>
            <p>
              Следите за статистикой, сравнивайте торговые точки и получайте уведомления о негативных оценках в
              Telegram.
            </p>
          </li>
        </ol>
      </section>

      <section className={styles.benefitsSection}>
        <div className={styles.benefitsIntro}>
          <h2>Превратите обычный планшет в терминал для сбора отзывов</h2>
          <p>
            Не нужно покупать специальное оборудование. Откройте экран оценки в браузере и начните собирать обратную
            связь от посетителей. Если интернет временно пропадёт, оценки сохранятся на устройстве и отправятся после
            восстановления соединения.
          </p>
        </div>
        <div className={styles.benefitStats}>
          <article>
            <strong>3</strong>
            <span>Простых варианта оценки</span>
          </article>
          <article>
            <strong>1</strong>
            <span>Ссылка для запуска экрана</span>
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
          <p className={styles.kicker}>Быстрая реакция на отзывы</p>
          <h2>Узнавайте о негативных оценках сразу в Telegram</h2>
        </div>
        <p className={styles.sectionLead}>
          Когда посетитель оставляет негативную оценку, Telegram-бот отправляет уведомление владельцу или сотрудникам
          заведения. Вы видите, где возникла проблема и что написал клиент, если он оставил комментарий.
        </p>
        <div className={styles.reactionFlow}>
          <div>
            <span className={styles.flowNumber}>01</span>
            <strong>Посетитель оставляет оценку</strong>
            <p>Выбирает «Плохо» и при желании добавляет комментарий.</p>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <span className={styles.flowNumber}>02</span>
            <strong>Отзыв появляется в системе</strong>
            <p>Оценка сохраняется с указанием торговой точки и времени.</p>
          </div>
          <span aria-hidden="true">→</span>
          <div className={styles.telegramCard}>
            <span>03 · Telegram</span>
            <strong>Команда получает уведомление</strong>
            <p>Telegram-бот отправляет сообщение в личный или групповой чат.</p>
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
          <p className={styles.kicker}>Оформление под ваш бренд</p>
          <h2>Настройте экран оценки в стиле своего заведения</h2>
          <p>
            Добавьте логотип, выберите фон, фирменные цвета и иконки оценок. Благодаря предварительному просмотру вы
            сразу увидите, как экран обратной связи будет выглядеть на планшете.
          </p>
          <div className={styles.neutralNote}>Уровень применения оформления пока не согласован.</div>
        </div>
      </section>

      <section className={styles.venuesSection}>
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>Для офлайн-бизнеса</p>
          <h2>Сбор отзывов для кафе, магазинов и салонов</h2>
        </div>
        <p className={styles.sectionLead}>
          Один простой способ получать обратную связь от посетителей — независимо от типа заведения. Оценки помогают
          замечать проблемы с обслуживанием и сравнивать результаты разных точек.
        </p>
        <div className={styles.venueGrid}>
          <article>
            <span>Кофейни и рестораны</span>
            <h3>Узнавайте о проблемах с обслуживанием</h3>
            <p>Посетители оценивают визит и могут рассказать в комментарии о долгом ожидании или других неудобствах.</p>
          </article>
          <article>
            <span>Магазины</span>
            <h3>Сравнивайте качество обслуживания в филиалах</h3>
            <p>
              Смотрите оценки по каждой торговой точке, отслеживайте динамику и находите заведения с большим количеством
              негативных отзывов.
            </p>
          </article>
          <article>
            <span>Салоны красоты</span>
            <h3>Собирайте впечатления после посещения</h3>
            <p>Клиенты оставляют оценку и при желании рассказывают, что понравилось или что стоит улучшить.</p>
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scene, setScene] = useState<CabinetScene>(startOnboarding ? 'noLocations' : 'filled');
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
        <button type="button" className={styles.sidebarBrand} onClick={onExit} aria-label="На главную">
          <Mark /> <span>Отклик</span>
        </button>
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
        <div className={styles.accountMenu}>
          {menuOpen ? (
            <div className={styles.accountPopover} role="menu">
              <button type="button" role="menuitem" onClick={() => setMenuOpen(false)}>
                Компания и профиль
              </button>
              <button type="button" role="menuitem" onClick={() => setNotice('Настройки аккаунта ещё не согласованы')}>
                Настройки аккаунта
              </button>
              <button type="button" role="menuitem" onClick={onExit}>
                Выйти
              </button>
            </div>
          ) : null}
          <button type="button" className={styles.companyButton} onClick={() => setMenuOpen((open) => !open)}>
            <span className={styles.companyAvatar}>КС</span>
            <span className={styles.companyMeta}>
              <strong>Кофейни Север</strong>
              <small>Меню аккаунта</small>
            </span>
            <LogOut01 aria-hidden="true" />
          </button>
        </div>
      </aside>

      <section className={styles.workspaceMain}>
        <header className={styles.workspaceHeader}>
          <div>
            <span>Кофейни Север</span>
            <strong>{navItems.find((item) => item.id === view)?.label}</strong>
          </div>
          <div className={styles.headerTools}>
            <label className={styles.sceneSelect}>
              Состояние демо
              <select
                value={scene}
                onChange={(event) => {
                  setScene(event.target.value as CabinetScene);
                  setNotice('');
                }}
              >
                <option value="filled">Данные есть</option>
                <option value="loading">Загрузка</option>
                <option value="emptyPeriod">Нет оценок за период</option>
                <option value="noLocations">Нет точек</option>
                <option value="error">Ошибка загрузки</option>
                <option value="restricted">Доступ ограничен</option>
              </select>
            </label>
            <UIBadge tone="neutral" dot>
              Демонстрационные данные
            </UIBadge>
          </div>
        </header>
        {notice ? (
          <div className={styles.notice} role="status">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice('')} aria-label="Закрыть сообщение">
              ×
            </button>
          </div>
        ) : null}

        {view === 'overview' ? (
          <Overview onTablet={onTablet} scene={scene} onOpenSubscription={() => setView('subscription')} />
        ) : null}
        {view === 'reviews' ? <Reviews scene={scene} /> : null}
        {view === 'locations' ? (
          <Locations
            onTablet={onTablet}
            onNotice={setNotice}
            forceCreate={showOnboarding || scene === 'noLocations'}
            onCreated={() => {
              setShowOnboarding(false);
              setScene('filled');
            }}
            empty={scene === 'noLocations'}
          />
        ) : null}
        {view === 'telegram' ? <Telegram onNotice={setNotice} locked={scene === 'restricted'} /> : null}
        {view === 'subscription' ? <Subscription onNotice={setNotice} restricted={scene === 'restricted'} /> : null}
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

function Overview({
  onTablet,
  scene,
  onOpenSubscription,
}: {
  onTablet: () => void;
  scene: CabinetScene;
  onOpenSubscription: () => void;
}) {
  const [period, setPeriod] = useState<'7' | '30'>('7');

  if (scene === 'restricted') {
    return (
      <div className={styles.view}>
        <div className={styles.lockedState}>
          <UIBadge tone="error" dot>
            Доступ ограничен
          </UIBadge>
          <h2>Пробный период закончился</h2>
          <p>Аналитика и отзывы скрыты до оплаты. Можно открыть подписку и восстановить доступ.</p>
          <UIButton onPress={onOpenSubscription}>Открыть подписку</UIButton>
        </div>
      </div>
    );
  }

  if (scene === 'loading') {
    return (
      <div className={styles.view} aria-busy="true">
        <div className={styles.skeletonGrid}>
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <div className={styles.skeletonRow} />
          <span>Загружаем статистику…</span>
        </div>
      </div>
    );
  }

  if (scene === 'error') {
    return (
      <div className={styles.view}>
        <div className={styles.errorState}>
          <AlertCircle aria-hidden="true" />
          <h2>Не удалось загрузить статистику</h2>
          <p>Демо-ошибка сети. В рабочем сервисе здесь будет повтор запроса.</p>
          <UIButton color="secondary" onPress={onOpenSubscription}>
            Повторить позже
          </UIButton>
        </div>
      </div>
    );
  }

  if (scene === 'noLocations') {
    return (
      <div className={styles.view}>
        <div className={styles.emptyState}>
          <h2>В компании пока нет точек</h2>
          <p>Добавьте заведение, чтобы начать сбор оценок и увидеть аналитику.</p>
        </div>
      </div>
    );
  }

  const empty = scene === 'emptyPeriod';
  const total = period === '7' ? '248' : '1 064';

  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Состояние сети</p>
          <h1>Что говорят гости</h1>
        </div>
        <label className={styles.inlineSelect}>
          Период
          <select value={period} onChange={(event) => setPeriod(event.target.value as '7' | '30')}>
            <option value="7">Последние 7 дней</option>
            <option value="30">Последние 30 дней</option>
          </select>
        </label>
      </div>

      {empty ? (
        <div className={styles.emptyState}>
          <h2>За выбранный период оценок нет</h2>
          <p>Точки подключены, но за этот интервал гости ещё не оставляли оценки.</p>
        </div>
      ) : (
        <>
          <section className={styles.uiStatsGridFour}>
            <UIStatCard label="Всего оценок" value={total} detail="По двум торговым точкам" icon={BarChartSquare02} />
            <UIStatCard
              label="Хорошо"
              value={period === '7' ? '178' : '766'}
              detail="72% · позитивные"
              icon={TrendUp01}
            />
            <UIStatCard
              label="Нормально"
              value={period === '7' ? '48' : '191'}
              detail="19% · нейтральные"
              icon={CheckCircle}
            />
            <UIStatCard
              label="Плохо"
              value={period === '7' ? '22' : '107'}
              detail="9% · негативные"
              icon={MessageSquare01}
            />
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
                  <h2>Сравнение точек</h2>
                  <p>Количество и доли за выбранный период</p>
                </div>
              </div>
              <div className={styles.locationCompare}>
                <div className={styles.compareHeader}>
                  <span aria-hidden="true" />
                  <span>Оценки</span>
                  <span>Хорошо</span>
                  <span>Нормально</span>
                  <span>Плохо</span>
                </div>
                {initialLocations.map((location) => (
                  <div key={location.id}>
                    <strong>{location.name.replace('Кофейня ', '')}</strong>
                    <span>{location.counts[period]}</span>
                    <span>{location.share.good}</span>
                    <span>{location.share.ok}</span>
                    <span>{location.share.bad}</span>
                  </div>
                ))}
              </div>
            </section>
            <section className={styles.panel}>
              <div className={styles.panelHeading}>
                <div>
                  <h2>Последние отзывы</h2>
                  <p>Комментарий показывается только если гость его оставил</p>
                </div>
              </div>
              <div className={styles.compactReviews}>
                {reviews
                  .filter((review) => review.period === period)
                  .slice(0, 3)
                  .map((review) => (
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
        </>
      )}

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

function Reviews({ scene }: { scene: CabinetScene }) {
  const [filter, setFilter] = useState<'Все' | Rating>('Все');
  const [location, setLocation] = useState('Все точки');
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const visible = reviews.filter((review) => {
    if (scene === 'emptyPeriod') return false;
    if (period === '7' && review.period !== '7') return false;
    if (filter !== 'Все' && review.rating !== filter) return false;
    if (location !== 'Все точки' && review.location !== location) return false;
    return true;
  });

  if (scene === 'restricted') {
    return (
      <div className={styles.view}>
        <div className={styles.lockedState}>
          <h2>Отзывы недоступны</h2>
          <p>После окончания пробного периода список оценок скрыт до оплаты.</p>
        </div>
      </div>
    );
  }

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
          Период
          <select value={period} onChange={(event) => setPeriod(event.target.value as '7' | '30')}>
            <option value="7">7 дней</option>
            <option value="30">30 дней</option>
          </select>
        </label>
        <label>
          Точка
          <select value={location} onChange={(event) => setLocation(event.target.value)}>
            <option>Все точки</option>
            <option>Кофейня на Центральной</option>
            <option>Кофейня у парка</option>
          </select>
        </label>
      </div>
      <section className={styles.reviewList} aria-live="polite">
        {visible.length === 0 ? (
          <div className={styles.emptyState}>
            <h2>Нет отзывов по фильтру</h2>
            <p>Смените период, точку или тип оценки — пустой список это штатное состояние.</p>
          </div>
        ) : (
          visible.map((review) => (
            <article key={`${review.location}-${review.date}`}>
              <RatingBadge rating={review.rating} />
              <div>
                {review.comment ? (
                  <p>«{review.comment}»</p>
                ) : (
                  <p className={styles.mutedText}>Комментарий не оставлен</p>
                )}
                <span>{review.location}</span>
              </div>
              <time>{review.date}</time>
            </article>
          ))
        )}
      </section>
    </div>
  );
}

function Locations({
  onTablet,
  onNotice,
  forceCreate,
  onCreated,
  empty,
}: {
  onTablet: () => void;
  onNotice: (message: string) => void;
  forceCreate: boolean;
  onCreated: () => void;
  empty: boolean;
}) {
  const dialogTitleId = useId();
  const [dialogOpen, setDialogOpen] = useState(forceCreate);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [confirmScreen, setConfirmScreen] = useState<{ locationId: string; screenId: string; name: string } | null>(
    null,
  );
  const [appearanceFor, setAppearanceFor] = useState<string | null>(null);
  const [accent, setAccent] = useState('#101828');
  const [paidSlots] = useState(2);
  const [items, setItems] = useState(initialLocations);

  useEffect(() => {
    if (forceCreate) setDialogOpen(true);
  }, [forceCreate]);

  function createLocation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      onNotice('Укажите название точки');
      return;
    }
    if (items.length >= paidSlots) {
      onNotice('Лимит подписки: 2 оплачиваемые точки. Третья станет доступна после изменения тарифа.');
      return;
    }
    setItems((current) => [
      ...current,
      {
        id: name.trim(),
        name: name.trim(),
        counts: { '7': 0, '30': 0 },
        share: { good: '—', ok: '—', bad: '—' },
        screens: [{ id: 'new', name: 'Основной экран', active: true }],
      },
    ]);
    setDialogOpen(false);
    onCreated();
    onNotice(`Точка «${name.trim()}» создана. Экран готов к настройке.`);
    setName('');
  }

  const visibleItems = empty ? [] : items;

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
      {visibleItems.length === 0 ? (
        <div className={styles.emptyState}>
          <h2>Нет торговых точек</h2>
          <p>Создайте первую точку — этого достаточно, чтобы получить ссылку экрана.</p>
        </div>
      ) : (
        <section className={styles.locationList}>
          {visibleItems.map((location, index) => (
            <article key={location.id}>
              <div className={styles.locationIndex}>{String(index + 1).padStart(2, '0')}</div>
              <div>
                {editId === location.id ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      setEditId(null);
                      onNotice('Название точки сохранено');
                    }}
                  >
                    <input
                      value={location.name}
                      onChange={(event) =>
                        setItems((current) =>
                          current.map((item) =>
                            item.id === location.id ? { ...item, name: event.target.value } : item,
                          ),
                        )
                      }
                    />
                  </form>
                ) : (
                  <h2>{location.name}</h2>
                )}
                <p>
                  {location.screens.length} экран(а) · {location.counts['7']} оценок за 7 дней · статистика точки, не
                  устройств
                </p>
              </div>
              <div className={styles.screenLinks}>
                {location.screens.map((screen) => (
                  <div key={screen.id} className={styles.screenRow}>
                    <button
                      type="button"
                      className={styles.screenChip}
                      data-paused={(!screen.active).toString()}
                      onClick={() =>
                        screen.active
                          ? setConfirmScreen({ locationId: location.id, screenId: screen.id, name: screen.name })
                          : setItems((current) =>
                              current.map((item) =>
                                item.id === location.id
                                  ? {
                                      ...item,
                                      screens: item.screens.map((entry) =>
                                        entry.id === screen.id ? { ...entry, active: true } : entry,
                                      ),
                                    }
                                  : item,
                              ),
                            )
                      }
                    >
                      {screen.name} <span>{screen.active ? 'Активен · отключить' : 'Отключён · включить'}</span>
                    </button>
                    <button
                      type="button"
                      className={styles.screenCopy}
                      aria-label={`Копировать ссылку экрана «${screen.name}»`}
                      onClick={() => onNotice(`Ссылка «${screen.name}» скопирована`)}
                    >
                      <Copy01 />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className={styles.screenChip}
                  onClick={() => {
                    setItems((current) =>
                      current.map((item) =>
                        item.id === location.id
                          ? {
                              ...item,
                              screens: [
                                ...item.screens,
                                { id: `extra-${item.screens.length}`, name: 'Новый экран', active: true },
                              ],
                            }
                          : item,
                      ),
                    );
                    onNotice('Экран добавлен. Ссылка уникальна, оценки привязаны к точке.');
                  }}
                >
                  + Создать экран <span>Ссылка</span>
                </button>
              </div>
              <div className={styles.locationMenu}>
                <MenuTrigger>
                  <AriaButton className={styles.locationMenuTrigger} aria-label={`Действия для «${location.name}»`}>
                    <DotsHorizontal />
                  </AriaButton>
                  <Popover placement="bottom end" offset={8} className={styles.locationMenuPopover}>
                    <Menu
                      aria-label={`Действия для «${location.name}»`}
                      className={styles.locationMenuList}
                      onAction={(key) => {
                        if (key === 'edit') setEditId(location.id);
                        if (key === 'appearance') setAppearanceFor(location.id);
                        if (key === 'open') onTablet();
                      }}
                    >
                      <MenuItem id="edit" textValue="Изменить" className={styles.locationMenuItem}>
                        <Edit01 />
                        <span>Изменить</span>
                      </MenuItem>
                      <MenuItem id="appearance" textValue="Оформление" className={styles.locationMenuItem}>
                        <Settings01 />
                        <span>Оформление</span>
                      </MenuItem>
                      <MenuItem id="open" textValue="Открыть" className={styles.locationMenuItem}>
                        <ArrowUpRight />
                        <span>Открыть</span>
                      </MenuItem>
                    </Menu>
                  </Popover>
                </MenuTrigger>
              </div>
            </article>
          ))}
        </section>
      )}
      <div className={styles.scopeNote}>
        <strong>Требует решения</strong>
        <span>Уровень применения оформления — компания, точка или отдельный экран — ещё не согласован.</span>
      </div>

      {appearanceFor ? (
        <div className={styles.dialogBackdrop}>
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="appearance-title">
            <button
              type="button"
              className={styles.dialogClose}
              onClick={() => setAppearanceFor(null)}
              aria-label="Закрыть"
            >
              ×
            </button>
            <p className={styles.kicker}>Кастомизация экрана</p>
            <h2 id="appearance-title">Предпросмотр оформления</h2>
            <div className={styles.appearanceGrid}>
              <label>
                Логотип
                <input
                  type="file"
                  accept="image/*"
                  onChange={() => onNotice('Файл принят в демо. Ошибка формата пока не задана.')}
                />
              </label>
              <div>
                <span>Основной цвет</span>
                <div className={styles.colorSwatches}>
                  {['#101828', '#b42318', '#067647', '#175cd3'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      style={{ background: color }}
                      data-selected={accent === color}
                      aria-label={color}
                      onClick={() => setAccent(color)}
                    />
                  ))}
                </div>
              </div>
              <div className={styles.miniTablet} style={{ borderColor: accent }}>
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
              <UIButton
                onPress={() => {
                  onNotice('Оформление сохранено в демо');
                  setAppearanceFor(null);
                }}
              >
                Применить
              </UIButton>
            </div>
          </div>
        </div>
      ) : null}

      {confirmScreen ? (
        <div className={styles.dialogBackdrop}>
          <div className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="pause-title">
            <h2 id="pause-title">Отключить «{confirmScreen.name}»?</h2>
            <p className={styles.fieldNote}>Оценки перестанут приниматься по этой ссылке. Историю точки не удаляем.</p>
            <div className={styles.locationActions}>
              <UIButton
                onPress={() => {
                  setItems((current) =>
                    current.map((item) =>
                      item.id === confirmScreen.locationId
                        ? {
                            ...item,
                            screens: item.screens.map((entry) =>
                              entry.id === confirmScreen.screenId ? { ...entry, active: false } : entry,
                            ),
                          }
                        : item,
                    ),
                  );
                  setConfirmScreen(null);
                  onNotice('Экран отключён');
                }}
              >
                Отключить
              </UIButton>
              <UIButton color="secondary" onPress={() => setConfirmScreen(null)}>
                Отмена
              </UIButton>
            </div>
          </div>
        </div>
      ) : null}

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

function Telegram({ onNotice, locked }: { onNotice: (message: string) => void; locked: boolean }) {
  const [connected, setConnected] = useState(false);
  const [chats, setChats] = useState([
    { id: 'dm', kind: 'Личный чат', name: 'Владелец', on: true },
    { id: 'group', kind: 'Группа', name: 'Смена на Центральной', on: false },
  ]);

  if (locked) {
    return (
      <div className={styles.view}>
        <div className={styles.lockedState}>
          <h2>Telegram недоступен</h2>
          <p>При ограниченном доступе подключение чатов приостанавливается.</p>
        </div>
      </div>
    );
  }

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
          {connected ? (
            <div className={styles.chatList}>
              {chats.map((chat) => (
                <label key={chat.id} className={styles.chatRow}>
                  <span>
                    <strong>{chat.kind}</strong>
                    <br />
                    {chat.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={chat.on}
                    onChange={() =>
                      setChats((current) =>
                        current.map((item) => (item.id === chat.id ? { ...item, on: !item.on } : item)),
                      )
                    }
                  />
                </label>
              ))}
            </div>
          ) : null}
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

function Subscription({ onNotice, restricted }: { onNotice: (message: string) => void; restricted: boolean }) {
  const [locations, setLocations] = useState(2);
  const [renew, setRenew] = useState(true);
  const [status, setStatus] = useState<SubscriptionStatus>(restricted ? 'expired' : 'trial');
  useEffect(() => {
    if (restricted) setStatus('expired');
  }, [restricted]);
  const copy: Record<
    SubscriptionStatus,
    { title: string; detail: string; tone: 'warning' | 'success' | 'error' | 'neutral' }
  > = {
    trial: { title: 'Пробный период', detail: '6 дней осталось', tone: 'warning' },
    trialEnding: { title: 'Пробный период скоро закончится', detail: '1 день остался', tone: 'warning' },
    paid: { title: 'Платная подписка', detail: 'Активна, следующее списание 27 ноября', tone: 'success' },
    paymentError: { title: 'Ошибка оплаты', detail: 'Последнее списание не прошло', tone: 'error' },
    renewOff: {
      title: 'Автопродление отключено',
      detail: 'Доступ сохранится до конца оплаченного периода',
      tone: 'neutral',
    },
    expired: { title: 'Подписка закончилась', detail: 'Доступ к кабинету ограничен', tone: 'error' },
  };
  const current = copy[status];

  return (
    <div className={styles.view}>
      <div className={styles.viewTitle}>
        <div>
          <p className={styles.kicker}>Управление доступом</p>
          <h1>Подписка</h1>
        </div>
      </div>
      <fieldset className={styles.statusPills}>
        <legend className={styles.srOnly}>Состояния подписки</legend>
        {(
          [
            ['trial', 'Пробный'],
            ['trialEnding', 'Скоро конец'],
            ['paid', 'Оплачена'],
            ['paymentError', 'Ошибка оплаты'],
            ['renewOff', 'Без продления'],
            ['expired', 'Истекла'],
          ] as const
        ).map(([id, label]) => (
          <button key={id} type="button" aria-pressed={status === id} onClick={() => setStatus(id)}>
            {label}
          </button>
        ))}
      </fieldset>
      <section className={styles.subscriptionGrid}>
        <div className={styles.currentPlan}>
          <UIBadge tone={current.tone} dot>
            {current.title}
          </UIBadge>
          <h2>{current.title}</h2>
          <strong>{current.detail}</strong>
          <dl>
            <div>
              <dt>Оплачиваемых точек</dt>
              <dd>{locations}</dd>
            </div>
            <div>
              <dt>Следующее продление</dt>
              <dd>{status === 'paid' ? '27 ноября' : 'После выбора тарифа'}</dd>
            </div>
            <div>
              <dt>Платёжный способ</dt>
              <dd>{status === 'paid' || status === 'paymentError' ? 'Карта · провайдер не выбран' : 'Не добавлен'}</dd>
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
            <small>
              Изменение числа точек учитывается со следующего месяца — правило созвона, в КП отдельно не раскрыто.
            </small>
          </div>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={renew && status !== 'renewOff'}
              onChange={(event) => {
                setRenew(event.target.checked);
                if (!event.target.checked) {
                  setStatus('renewOff');
                  onNotice('Автопродление отключено. Нужно подтверждение в рабочем сценарии.');
                }
              }}
            />
            Автоматическое продление
          </label>
          <UIButton
            iconLeading={CreditCard01}
            iconTrailing={ArrowUpRight}
            onPress={() => {
              if (status === 'paymentError') {
                onNotice('Повторная оплата не прошла. Доступ остаётся ограниченным.');
                return;
              }
              setStatus('paid');
              onNotice('Успешная оплата в демо. Доступ восстановлен.');
            }}
          >
            {status === 'expired' || status === 'paymentError' ? 'Оплатить и восстановить доступ' : 'Перейти к оплате'}
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
