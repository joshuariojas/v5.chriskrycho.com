import { env } from 'process';

import { DateTime } from 'luxon';

import { Config, Item, UserConfig, Collection } from '../types/eleventy';
import absoluteUrl from './absolute-url';
import archiveByYear, { byDate, byUpdated, Order } from './archive-by-year';
import copyright from './copyright';
import currentPage from './current-page';
import toDateTime, { canParseDate, fromDateOrString, TZ } from './date-time';
import isoDate from './iso-date';
import localeDate from './locale-date';
import markdown from './markdown';
import * as PageLinks from './page-links';
import spacewell from './plugin-spacewell';
import typeset from './plugin-typeset';
import siteTitle from './site-title';
import excludingCollection from './excluding-collection';
import toCollection from './to-collection';

import './feed'; // for extension of types -- TODO: move those types elsewhere!

const BUILD_TIME = DateTime.fromJSDate(new Date(), TZ).toSeconds();

// Hack around the fact that in dev I want this to work on *every run*, but in prod builds
// I just want one time for the whole run.
const buildTime = () =>
   env.DEV ? DateTime.fromJSDate(new Date(), TZ).toSeconds() : BUILD_TIME;

const isLive = (item: Item) =>
   canParseDate(item.date) &&
   fromDateOrString(item.date).toSeconds() <= buildTime() &&
   !item.data?.draft;

const isNotVoid = <A>(a: A | null | undefined): a is A => a != null;

const excludingStandalonePages = (item: Item): boolean =>
   !(item.data?.standalonePage ?? false);

const filterStandalonePages = (items: Item[]) => items.filter(excludingStandalonePages);

/**
   Use a path to create a collection from all items contained within it.

   @param config The eleventy config
   @param path   The path to filter as a collection
   @param name   An optional override name. If not supplied, the name will be a
                 slugified version of the path, e.g. `foo/bar` -> `foo-bar`
 */
function addCollectionFromDir(config: Config, path: string, name: string = path): void {
   config.addCollection(name, (collections) =>
      collections
         .getAll()
         .filter((item) => item.inputPath.includes(path))
         .filter(isLive)
         .filter(excludingStandalonePages)
         .sort(byDate(Order.NewFirst)),
   );
}

const inCollectionNamed = (name: string) => (item: Item): boolean =>
   item.data?.collections[name]?.includes(item) ?? false;

type Not = <A extends unknown[]>(
   pred: (...args: A) => boolean,
) => (...args: A) => boolean;
const not: Not = (fn) => (...args) => !fn(...args);

function latest(collection: Collection): Item[] {
   const all = collection
      .getAll()
      .filter(isLive)
      .filter(excludingStandalonePages)
      .sort(byDate(Order.NewFirst));

   return [
      all.find(inCollectionNamed('essays')),
      all.find(inCollectionNamed('journal')),
      all.find(inCollectionNamed('notes')),
      all.find(inCollectionNamed('library')),
      all.find(inCollectionNamed('elsewhere')),
   ]
      .filter(isNotVoid)
      .sort(byDate(Order.NewFirst));
}

const hasUpdated = (item: Item) => canParseDate(item.data?.updated);

function mostRecentlyUpdated(collection: Collection): Item[] {
   const all = collection
      .getAll()
      .filter(isLive)
      .filter(excludingStandalonePages)
      .filter(hasUpdated)
      .sort(byUpdated(Order.NewFirst));

   return [
      all.find(inCollectionNamed('essays')),
      all.find(inCollectionNamed('journal')),
      all.find(inCollectionNamed('library')),
   ]
      .filter(isNotVoid)
      .sort(byUpdated(Order.NewFirst));
}

const isFeatured = (item: Item): boolean => item.data?.featured ?? false;

const featured = (collection: Collection): Item[] =>
   collection
      .getAll()
      .filter(isLive)
      .filter(excludingStandalonePages)
      .sort(byDate(Order.NewFirst))
      .filter(isFeatured)
      .sort(byDate(Order.NewFirst));

function config(config: Config): UserConfig {
   config.addPlugin(
      typeset({
         only: '.content-block',
         disable: ['smallCaps', 'hyphenate', 'ligatures', 'smallCaps'],
      }),
   );

   config.addPlugin(spacewell({ emDashes: true, enDashes: true }));

   config.addFilter('md', markdown.render.bind(markdown));
   config.addFilter('inlineMd', markdown.renderInline.bind(markdown));

   config.addFilter('toCollection', toCollection);
   config.addFilter('stringify', (obj) => JSON.stringify(obj));
   config.addFilter('archiveByYears', archiveByYear);
   config.addFilter('absoluteUrl', absoluteUrl);
   config.addFilter('isoDate', isoDate);
   config.addFilter('toDateTime', toDateTime);
   config.addFilter('siteTitle', siteTitle);
   config.addFilter('withValidDate', (items: Item[]) =>
      items.filter((item) => canParseDate(item.date)),
   );
   config.addFilter('current', currentPage);
   config.addFilter('editLink', PageLinks.edit);
   config.addFilter('historyLink', PageLinks.history);
   config.addFilter('sourceLink', PageLinks.source);
   config.addFilter('excludingCollection', excludingCollection);
   config.addFilter('excludingStandalonePages', filterStandalonePages);
   config.addFilter('concat', (a: Item[] | undefined, b: Item[] | undefined) => {
      return (a ?? []).concat(b ?? []);
   });
   config.addFilter('localeDate', localeDate);
   config.addFilter('isLive', (items: Item[]) => items.filter(isLive));

   config.addShortcode('localeDate', localeDate);
   config.addShortcode('copyright', copyright);

   config.addPassthroughCopy('site/_redirects');
   config.addPassthroughCopy('site/robots.txt');
   config.addPassthroughCopy({
      'site/_assets': 'assets',
      'site/_styles': 'styles',
   });

   config.addCollection('live', (collection) => collection.getAllSorted().filter(isLive));
   config.addCollection('pages', (collection) =>
      collection.getAll().filter((item) => item.data?.standalonePage),
   );
   addCollectionFromDir(config, 'journal');
   addCollectionFromDir(config, 'essays');
   addCollectionFromDir(config, 'library');
   addCollectionFromDir(config, 'notes');
   addCollectionFromDir(config, 'elsewhere');

   config.addCollection('nonNotes', (collection) =>
      collection
         .getAllSorted()
         .filter(isLive)
         .filter(not(inCollectionNamed('notes'))),
   );

   config.addCollection('latest', latest);
   config.addCollection('updated', mostRecentlyUpdated);
   config.addCollection('featured', featured);

   config.setLibrary('md', markdown);

   config.setDataDeepMerge(true);

   return {
      dir: {
         input: 'site',
         output: 'public',
         includes: '_includes',
         layouts: '_layouts',
      },
      templateFormats: ['html', 'njk', '11ty.js', 'md'],
      dataTemplateEngine: 'njk',
      htmlTemplateEngine: 'njk',
      markdownTemplateEngine: 'njk',
   };
}

// Needs to be this way so that the import resolves as expected in `.eleventy.js`.
module.exports = config;
