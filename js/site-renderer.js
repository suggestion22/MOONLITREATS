(() => {
  const content = window.MoonlitreatsContent;
  const characters = window.MoonlitreatsCharacters || [];
  if (!content) return;

  const createElement = (tagName, className, text) => {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  };

  const createImage = (src, alt, className) => {
    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.loading = "lazy";
    image.decoding = "async";
    if (className) image.className = className;
    return image;
  };

  const appendChildren = (parent, children) => {
    children.filter(Boolean).forEach((child) => parent.appendChild(child));
    return parent;
  };

  const refreshReveals = () => {
    window.Moonlitreats?.refreshReveals?.();
  };

  const renderHome = () => {
    const hero = document.querySelector("[data-home-hero]");
    const newsList = document.querySelector("[data-news-list]");
    const episodeList = document.querySelector("[data-home-episodes]");
    const characterList = document.querySelector("[data-home-characters]");
    if (hero) {
      hero.innerHTML = "";
      const copy = createElement("div", "home-hero-copy reveal-item");
      const tags = createElement("div", "hero-status-row");
      content.hero.tags.forEach((tag) => tags.appendChild(createElement("span", "", tag)));

      const actions = createElement("div", "hero-action-row");
      const primary = createElement("a", "text-link-button", content.hero.primaryCta.label);
      primary.href = content.hero.primaryCta.href;
      const secondary = createElement("a", "text-link-button is-soft", content.hero.secondaryCta.label);
      secondary.href = content.hero.secondaryCta.href;
      appendChildren(actions, [primary, secondary]);

      appendChildren(copy, [
        createElement("p", "eyebrow", content.hero.eyebrow),
        createElement("h1", "", content.hero.title),
        createElement("p", "hero-subtitle", content.hero.subtitle),
        createElement("p", "hero-stage-note", content.hero.stage),
        tags,
        actions
      ]);

      const visual = createElement("div", "home-hero-card reveal-item");
      visual.appendChild(createImage(content.hero.image, content.hero.imageAlt, "home-hero-image"));
      appendChildren(hero, [copy, visual]);
    }

    if (newsList) {
      newsList.innerHTML = "";
      content.news.forEach((item) => {
        const article = createElement("article", "reveal-item");
        const time = createElement("time", "", item.date.replaceAll("-", "."));
        time.dateTime = item.date;
        appendChildren(article, [time, createElement("p", "", item.title)]);
        newsList.appendChild(article);
      });
    }

    if (episodeList) {
      episodeList.innerHTML = "";
      content.episodes.slice(0, 2).forEach((episode) => {
        episodeList.appendChild(createEpisodeCard(episode, "episode-card is-compact reveal-item"));
      });
    }

    if (characterList) {
      characterList.innerHTML = "";
      characters.slice(0, 3).forEach((character) => {
        characterList.appendChild(createCharacterPreview(character));
      });
    }
  };

  const renderAbout = () => {
    const about = document.querySelector("[data-about-content]");
    if (!about) return;

    about.innerHTML = "";
    const intro = createElement("section", "brand-about-intro reveal-item");
    appendChildren(intro, [
      createElement("p", "eyebrow", content.about.eyebrow),
      createElement("h1", "", content.about.title),
      ...content.about.paragraphs.map((text) => createElement("p", "", text))
    ]);

    const valueGrid = createElement("section", "brand-value-grid");
    content.about.values.forEach((value) => {
      const article = createElement("article", "brand-value-card reveal-item");
      appendChildren(article, [
        createElement("strong", "", value.title),
        createElement("p", "", value.text)
      ]);
      valueGrid.appendChild(article);
    });

    appendChildren(about, [intro, valueGrid]);
  };

  const createCharacterPreview = (character) => {
    const article = createElement("article", "character-preview-card reveal-item");
    appendChildren(article, [
      createImage(character.image, `${character.name} 캐릭터 카드`, "character-preview-image"),
      createElement("span", "", getSeriesName(character.series)),
      createElement("strong", "", character.name),
      createElement("p", "", character.short)
    ]);
    return article;
  };

  const createCharacterCard = (character) => {
    const article = createElement("article", "character-card character-image-card reveal-item");
    article.setAttribute("role", "button");
    article.setAttribute("tabindex", "0");
    article.setAttribute("aria-label", `${character.name} 캐릭터 자세히 보기`);
    article.dataset.character = character.id;
    appendChildren(article, [
      createImage(character.image, `${character.name} 캐릭터 카드`, "character-card-art"),
      appendChildren(createElement("div", "character-card-info"), [
        createElement("span", "character-series-label", getSeriesName(character.series)),
        createElement("strong", "character-name-label", character.name),
        createElement("p", "", character.short)
      ])
    ]);
    return article;
  };

  const getSeriesName = (seriesId) => {
    return content.series.find((series) => series.id === seriesId)?.name || seriesId;
  };

  const renderCharacters = () => {
    const seriesList = document.querySelector("[data-character-series-list]");
    if (!seriesList) return;

    seriesList.innerHTML = "";
    content.series.forEach((series) => {
      const section = createElement("section", "character-series reveal-item");
      const heading = createElement("div", "character-series-heading");
      appendChildren(heading, [
        createElement("p", "eyebrow", series.name),
        createElement("h2", "", series.name),
        createElement("p", "", series.description)
      ]);

      const grid = createElement("div", "character-grid characters-visual-grid");
      characters
        .filter((character) => character.series === series.id)
        .forEach((character) => grid.appendChild(createCharacterCard(character)));

      appendChildren(section, [heading, grid]);
      seriesList.appendChild(section);
    });
  };

  const createEpisodeCard = (episode, className = "episode-card reveal-item") => {
    const article = createElement("article", className);
    appendChildren(article, [
      createImage(episode.image, episode.imageAlt, "episode-image"),
      appendChildren(createElement("div", "episode-copy"), [
        createElement("span", "", episode.label),
        createElement("strong", "", episode.title),
        createElement("p", "", episode.description)
      ])
    ]);
    return article;
  };

  const renderEpisodes = () => {
    const episodeGrid = document.querySelector("[data-episode-grid]");
    if (!episodeGrid) return;
    episodeGrid.innerHTML = "";
    content.episodes.forEach((episode) => episodeGrid.appendChild(createEpisodeCard(episode)));
  };

  const renderGallery = () => {
    const galleryGrid = document.querySelector("[data-gallery-grid]");
    if (!galleryGrid) return;
    galleryGrid.innerHTML = "";
    content.gallery.forEach((item) => {
      const article = createElement("article", "reveal-item");
      appendChildren(article, [
        createImage(item.image, item.imageAlt, ""),
        appendChildren(createElement("span", ""), [
          document.createTextNode(`${item.label} / ${item.title}`)
        ])
      ]);
      galleryGrid.appendChild(article);
    });
  };

  const renderGoods = () => {
    const goodsGrid = document.querySelector("[data-goods-grid]");
    if (!goodsGrid) return;
    goodsGrid.innerHTML = "";
    content.goods.forEach((item) => {
      const article = createElement("article", "reveal-item");
      appendChildren(article, [
        createElement("small", "", item.code),
        createElement("span", "", item.name),
        createElement("p", "", item.text),
        createElement("strong", "", item.status)
      ]);
      goodsGrid.appendChild(article);
    });
  };

  renderHome();
  renderAbout();
  renderCharacters();
  renderEpisodes();
  renderGallery();
  renderGoods();
  refreshReveals();
})();
