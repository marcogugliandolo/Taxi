/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerApp from './components/CustomerApp';
import DriverApp from './components/DriverApp';
import { ThemeProvider } from './ThemeProvider';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CustomerApp />} />
          <Route path="/driver" element={<DriverApp />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
