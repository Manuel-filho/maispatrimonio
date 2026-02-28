<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;

class NetWorthService
{
    /**
     * Atualiza o recorde de património líquido (max_net_worth) do utilizador.
     *
     * @param User $user
     * @return void
     */
    public function updateMaxNetWorth(User $user)
    {
        $currentNetWorth = $user->total_net_worth;

        if ($currentNetWorth > $user->max_net_worth) {
            $user->update(['max_net_worth' => $currentNetWorth]);
        }
    }

    /**
     * Recalcula e sincroniza o património líquido estático (opcional, para relatórios).
     *
     * @param User $user
     * @return void
     */
    public function syncNetWorth(User $user)
    {
        $user->update(['net_worth' => $user->total_net_worth]);
        $this->updateMaxNetWorth($user);
    }
}
