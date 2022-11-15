// Copyright (c) 2022 Contributors to the Suwayomi project
//
// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.
export {};
declare global {
  interface Window {
    myWindowAPI: {
      minimize: () => void;
      toggleMaximize: () => void;
      close: () => void;
    };
  }
}
