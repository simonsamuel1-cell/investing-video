/**
 * voEnvelope.ts — loudness of the recorded voice-over, ONE VALUE PER FRAME.
 *
 * Generated offline from public/vo/chart-memory.mp3 with ffmpeg; nothing here
 * decodes audio at render time. That matters: Remotion renders frames in
 * parallel across processes, so anything the picture depends on has to be a
 * pure function of the frame index, available synchronously. A precomputed
 * table is exactly that.
 *
 * How it was made (re-run this if the VO is ever re-recorded):
 *
 *   ffmpeg -i public/vo/chart-memory.mp3 \
 *     -af "aformat=channel_layouts=mono,aresample=44100,\
 *          asetnsamples=1470:p=0,astats=metadata=1:reset=1,\
 *          ametadata=print:key=lavfi.astats.Overall.RMS_level:file=rms.txt" \
 *     -f null -
 *
 * 1470 samples at 44.1 kHz is exactly one frame at 30 fps. Per-frame RMS in dB
 * is mapped -40 dB → 0 and -12 dB → 1, then run through an envelope
 * follower (attack 0.55, release 0.12) so it rises with a syllable and
 * falls away gently instead of chattering. Quantised to a byte per frame and
 * stored base64 — 8808 characters for all 6606 frames.
 */

const PACKED =
  "AAAAAAB3o7TW7O707uf0+vby7eXg3t3k6u/279LD3enhz76zuMfGwry3tbOxr66rqKalosXd29fV0bi0wsvNzMfExMfFwLao" +
  "qKekt7W8rZmYmJB+b2J7p8DKwr+5qJSCcmVZTkU8NS8pZaCtscXPwazZ7urjyMfErKKmpbS8tqy1sKuqvbuuu7uus7OvoZ67" +
  "rJitubSemrKupZ6Xs8DAvrvJ0dDPysK4rqCSipOPfqe3tLC2zdPIurC8093d29nX1M/Gt6OPfm9iVkxDOzQtKDWJyufx8vXv" +
  "5tK5r8vKyNzi3eLg3ODi3tjc4eTk4uDc17+olLjGvri9ztDNw7qjkIe4zdPTz7ymkoBxY1dig46MiJWSgXOVrLeqloSwxMO8" +
  "sa2poo9+lK+tp6GVg3qcsLi3s6CNfG1pb26Mt8nMyMK4oqvK09PMtKOawdPQvqeTk5ynpJuQl5SRnaytpqWnqqmoqqupo5uS" +
  "hHR7m6unpJ+Me2x3eHZsZYORko+FdWdbgHh2f358eHV0eoGAeWpeUklAODEsJiIedMDj3tPe5d/a2d/q8fn8+vb19fDl29PP" +
  "yrKcmL/BvKyXqby5s62pq6Ghsbq1rJ2LoKCalpSQi4aFh4+Wn6GgnJaOgnNlWU5FPTUvKSQgHBlrvMvk8/r7+/j18e7s59rA" +
  "vsrIwr29uK6io6XAwr+8ubKrqKilkYSPkYh3cpW1zMq2pJ6Sinp3j46LhYOGhH55foqAl62ij42gr66pn5KAcWNXTUQ8NC4p" +
  "JB8cGnC4ttnu9/f7+/3+/ubZ5fPs4tvh3cvG0NfTxsHDwLyzp5uIeGpdUkg/ODErJiEdGhcUOl9XUarPzbWox9jj8vDv7uPg" +
  "3tC3yszIsJuzwsfZ2c+/ub/Q4ufl4t/XzsS6rqKRgHBjV01DOzQycZOhoKu6t7Kko6OZuM3Z2MGqtMHO0dHPzMrHvq+otr/B" +
  "wb20not7dHuXrK6rqa2qpauxsamVmLDEyMe7q6Kelo19bmFVS0I6My0nIx8bGyyg1M/R6uXf3Ozr6OHa7u/r6uLHyt7U0NfS" +
  "6/bw4t3k4dm/vNDPycjL3Orp4MWtmIZ2gJqko6GfnqSkpKGZsMjKx8G9vb29tqmdnZqUjYFyk66wrKCVpKGNf6etm4h6l7DH" +
  "1NPPx7mtoIx8bWBUSkE5MywnP2+alouWpKi51NnWy7q4rJ+bpK65v768rZmGdnanz+Pq6OLb1bylkYBxY1dNRDs0LigkHxyF" +
  "yObr48mxpJq1x8nEvbi4xc/OyMK8tquil6O5xMLAvbStqqmpp6WZkIiFmZ6ip6WWiY3B4+/t59zOvKWSgHFjV01EPDQuKSRJ" +
  "bnaNpKSuq6CflYeduKKOi8vn9Pjx1LukqtHd19DJw8C9u7GlrK2nk4Fyo7q8t7KtqKiqnpauvLu2r6mfkpCjop2YlpKBcXiG" +
  "kIyWlpCFem5iVkxDOzQuKCMfHprRz8/a0MbPwt/x68/P6fX18/Hu7e3o4c7KysjAua2xtbOws8nQy8W/vbmvqJ6msbCqpaWk" +
  "oZ+iopqHd2mCkpGKgnJtj66tx9zZ0MCtmYd2aFxRRz43WXyAcX+biJupp7rGvqecxsS3ss7N4uHRuKKgrKuorrWwq6Owr6um" +
  "nImdt6GOfW6ZwdXa2NbV0biiq6agjHySlpKOiXhqaKrI0dLQyLCbiHhqXVJIPzgxKyYhHYHG5fPv6uPi8u/d2tva08zKyMS/" +
  "ubnBw7Wtoba6vr65w8O/ure0raalq6mUjZmqpZGAnpuRi4ustbGtqLKsn5inqaekpZuIeHaEhYJ7cGJWTEM7NC4oIx8bGBUT" +
  "V7Td7OnZz8rWzrWiytXSyL64ppKMqq6qoJitv8jS1s/Ox6+akqOpoo+GkI9+b2OPoaqqpqOdlpCNlqCjoJeShpajqKinopqT" +
  "kp61wsK/urm1qpaEdGZaT0Y9Ni8qJSAca63a7url4uzny8jf3tvUyrKds9bdzbunurWir7ehm6uopLvBvLKrq6ajpLa1wtTR" +
  "0NrX0MKzsq2ooZmZna+8ztfc3tzSuaertbGciYmuureyraiqpqaSgIatuq2jo7e3saqln5iSkJCOioR5nrzW3tO6o5CFmL++" +
  "tJ+swb+5tLCurKiUgouZkZufnpOGfZe5ztbh39HX08zAr5qIlZ+Me6K3tbCqqa20sp2Lh6WxrqyrqKWkqaealZGOjo2KeWte" +
  "gpukpKetqqGThXVnW1BGPjYwKiUhHRkWX7ff8OvfxK2epMS+rb/g7e/myrKvubezq6elqrG2vLqvrrKrnpmdnaCfn418baPB" +
  "z9jg4+Da0cKrloR0ZlpPSV+urq2nk6jCsZuJeGpdUkg/ODErJiIdNqTW7e/s4Nnn6u/u7fL03sOsqrO1xtTMwMnIw7utmafM" +
  "4+fm4NjV0tDOzMS6qKa6zdC3oammo6OdioSdloR1j5qXk4p8cGVYTkU8NS8pb6erqsfk7ff38ezu7OLb6uTazsK9v8LBwL/G" +
  "wrzDw8XEwr23sa2qo6Kvr6OlmIaFkpejqaimq6yqopSEdGZaT0U9Ni8qJSBrnJTP6NXU6eHY7fHs5uXj172wq8O+vbu3oo+E" +
  "rcLS3eTgxa2koZ6bj4aYpKy1tbKlkX+Cf3l5goKAfoOMj46IeGpdUkg/ODErJiEdGhcUhLvD1ez37+fPw9vn3cO4vMfFwL7P" +
  "zsy6uMjHwrqytrW0wcjGxMe+sbCuq6mknZSFlrfCwr6plYNzZllPRT02LyolIFWw193P2e7s5OHh4t3Dt77GvLGwqZSDdpmv" +
  "u8DGysnGrpmMo5mHho9+b2J/kIp9bmx9fHt5dneMo7K6uq2YkqmkkIWQh3ZoXHqEh4iDgH14n8Xf3tnMuKKPh6fE0dDMxcO+" +
  "u7m1raaYi5SirrW0sq6aiHh2ts/QzMzLxKyruqiUi62tqqOXhXVnW1BGPjYwKiUhHRkWFB51mpbE5O3UztDQztnu6+bl5+Xa" +
  "2OPY1u33+/j39vTv59/Ty8nY29W7pau8sZyJp7m4sq6qqbi6uLaxqqCXi35vYVZLQnuBfoeRkZWIeJesutjt9/v9/v337t3D" +
  "q5eFdWdhnLe7urWwrKm9wcPAuK6ok4KisJuIh5KamZaqr6Ohp5OBgZygoJ6en5uTjop6a4iPjIiHioV1a32Rk46Eirzh8fnu" +
  "59e9ppKBcWRYTUQ8cr3f3dfS0c/Nz8zIxc7Mycji6ujhxrvA1dW8pauroZWop7SzppKRlI+Mjp2cmZCNpLq+s66qopyampeU" +
  "kpGIenZ8fHlta3t/cGNvpb29vLmyppuOgnNlWU5FPTUvKSQgHCxSpbejj6rW7ff14MWupaXCzc3P1NG4oo9+b2FWS0I6My2A" +
  "s8rLx8PBx9DW1tjWzsS3ubi2vtLh7/Ty6My0qKKZi6OuqqSdlJGOiXluY1dNQzs0LigkHxwYFT+ExsbK5+fi5uTh8vn538Tk" +
  "8+3n4+Db2NXNwr63oaG1uba4xtbg3Miwm4iWmpmTjoJyZFhORDw1Lyk0ibLCuaOPstDRzcjCtLnSz8CwtLu6ubWfjJOVj4yL" +
  "hnZocpuwsq6Zh6CcnZePrMfOzb2ysKeah3dpXFFHPzcxKyYhHRohS4iirMXUu7/e1NDq9e7Szs3Ly8rGwMTAucrJw8C/v7+4" +
  "s6ecud3w7+vfxKyYhnt7gYCAiIh4bI2tvrarv77Z3dzGr6HJzMa8rp+Me21gVEpBOTIsJyIeG3CWj7fd7+zexKyYhXVsa6ig" +
  "jKfDybmjj5immIV6r8vJspyKvLq0tLGbiYOv0ufYwbm0scjh7evo5+Hb2NTOy+Dq7vX05tXHydXh5+XNtcG2rZiovby2s7Gv" +
  "rKqxsa6nopWDh6evq6qklo6mv8e+tK+ouLazqKWrqqShn5qPiZCkpJyJeZ7G2+jn4dW8pZGAcWNXTURGodXs6ubgzcve3cKr" +
  "pMnOy8XDwcDExcC6qaazt7Osp6OPf4qTiHiDioiDeXh3dXRmW4aepqWgkX9wY1dMQzs0LigjHxsYK1Sq2e7w6+bk8Pj8/vbY" +
  "zc3l4+Hh6+7q4djSzs3T0tDJwbuzq6Kzys/OycTDz9TU09HPxcbFxMPGxsXBubGllJidnJqVjXxta4ebm5eRi42MioB6k56g" +
  "k5KbnZ2alY2CdWdbUEY+NzAqJSEdGRY4iMGyvuLLxeXk4Nzv+Pz++fL1+fLt6+bq6tW7t8zW6PXz7OLPvMvf39nU0dDQycTD" +
  "wbu4tbO0qpaWssfHxLu1zNjVvKmglKu1tKyei3psX1NJQTkyLCcwdJWcma26u7q4vb24ubjB1+vo4tvX1tbSyr2nk5+wrq2s" +
  "pp+qqqWRgIWfn56bm5+dnJySh4ajt7e1r6vH5u3p2cevmoh3aVxRSD83P4GSkI6Kn66xsKqlop+blpOluNLo9fXu5d7a2NXR" +
  "yb6umYy0wr24samjvNTcxK2oxsbCvby5tLCqn6Ottra1qZWDoK6fnZKJlZ2bkY2Rj4qHi4yKhXlsX1RKQTkyLCciHhsXFRIQ" +
  "K2u23vD38Ozp6OHd8Pj07+74/Pvw9vv37t/Sz8WzstLh297b1MvEwcC9rqKgnY6FmqemoJqXnZ2ZlJGRkIuCeW9nX1hVX25w" +
  "f5ehoaCdvsvFv7za7uno5uHZz8fDvrajmb/V1cjAx8G5ts3OtqCvrcza2Mu+v8vKv7Ows6+no62sl4iBnrO6rb7Lyb3Z5+PN" +
  "tZ+Me2xfVEpBOTIsJyJQgaK03fDu6uvo9Pr37/j8+vLm0dHZ1tDHxN/p5dbG0Obw9/n8+/bo29jNv72+w8Kyn5+mnJuXhXWZ" +
  "wtbRuKWdm6OfjHuAjY+PiYWKgn2GoaOSgIePjIGLyOb08+/n39rY1M/Dq5eFv+Lk4tvRyMTCwL67t7CppqeloJybmpqZrLm8" +
  "ubSqmpOQjIZ8bXeSkoJyZGBebnJ2d3Z7iJWMe2xyg4N/dmhbUEc+NzAqJSEdGRYUETRbjszo3tzh3NHY7evr9uvPttrs7Orl" +
  "39LAusjHxcTEw8K9ubWspaCfnamom4idnpuYk56xsaunpZuJeHeBkJeZnaOvv87b5Ofj2M3BurvBvrqzqZWTl5eapaWko6nI" +
  "4fH4+O/SuaOYlZC/1MaumZSmvNLZ2tW8q63Q2drZ1syzqZ6ckH6NiXhqZnCWqa2qpZmMe21gVEpBOTIsJyV/k7S2rqKdqLe9" +
  "vLarpJyYkY6Hk5OPipvD5PP58tW7pZeQuczMzMa/uKOQlpmHd4uUkIyKgHBxf3x2aFt5i4uIhIB6mZ+em4uCdGZaT0U9Ni8q" +
  "JSAcGUNIcbGwtcO/xeXk4OHg2sbe8O/p4MzG3+rr6OLc1Mu/sKzI0uTw6N7d0cDN1s7Q0Mm/1ODf1MK9ubOsqKenp6GZlIqM" +
  "iISEkZWUiXhqYoeWk5CMh4CIkZGPjYmEf3RnXFFHPzcwKyYhHRoXFBEPDQwKCQgHYLff2dHEx8/Mxb274fHw4ePr7Orn5uPe" +
  "3vD39OvhzbfP1M/K0c/PzMrK0MmxnImZtquXtMnGw8HAw7+8ubCei6Wkm4h8kJKQjomdoqGblIJzZVlTUk9cY3Z1b3iRlqbI" +
  "4/L5+fbt0MO/vrShjn5+f316dXGQqsvf39jSzczHvrWppaSjoJyUjpOiuNHY0szHxcO9tre2sqqhjoO1zsvGycfAu7iyraek" +
  "oZyVkZWnsre3tKSQf3BiV0xDOzQ8k8/e8PTz6ejn29De8O/nzrXAvLWkmsbQw6uXlamXkJyRiZ6alJirpZ2YmJeFdWd6q8PP" +
  "zcC6t7Ktqqael4+NjY2Khn1zZVlORT01LykkIBwZFhNnpqHV7Pb79fD4++/y7uTT0dDKw7++vsDAvbWfjHttYp2ei6nR18+2" +
  "oJuwub6+vLetpaOlpKCesLjDz9jRuKLGv7ulkpKSjomIh4SAf5KhsKymnpeSkKW2trGrpKCer6moytnU0tXQw6yXhXVnW1BG" +
  "PjYwKiUhOoWywsbEv7mwppyTkaSgnKaosL/a5vT6/f7//vv169/KsZyJeWpeUklAODErJiJintDo8unYvqmkpaShn6Obm5yJ" +
  "eYSBfG1oiIyGem5hVktCOjMtKCMfGxgVcqG2trGqo7jS4Orv7ejl0Lehj6i/wb24t7m/vLe1sq6pqamxq5eFhLPBv7qzp5mN" +
  "fG1gVEpBOTMtJyIeGySc0+vr4d/w89bV3+r19ff7+vby8PLq49TY6+bKw769v8K+ubezraSnsayYhYuJhoKChIeMiIWcssO/" +
  "t6ycqa2trKupqbrR39W7pZGAcGNbfaett7u6uLSjkH6pw9Hc4N3RxbbCsbCwr6qZm5iVmqSjn52koqCgnpyio56elIJzkpCU" +
  "l5mPfm+Fnq6vraWViHhsZFhORDw1LykkIBwZFnzEwOPy8tXQ2+/26Ov28vb08OrdytbU3Nva2NTOx8rPz8K2tK6npK2sqqam" +
  "v9Lg4+Pi4d/b1Mq8qpyRq7u7tKmaj5WswLasyefz8+3XxsK9q5qqv8zLysjFvbSuqqSgnZeSm7KtmIqknpmTkYl5fY6JeGuH" +
  "jIV8bmN7c3KOoLrIysnAtKSQf3BiVkxDOzQuKCMhdqO42e7ozMng3NjOtdHg7uvbwarDwrCosLCaiIu3ytjg4uLh4NzUxry5" +
  "t7Kxrqmmtb67p5Oer6yqo6OfkIWextfTuaOQjaSilZCOjXxtYGqdsbOupJB/cGJXTEM7NC4oIx8bGBUTEA4NCwoJCEyFnZu9" +
  "3dzY4ujj39vSx7+4wtTn8vn39O7l39fNw7qwqKWjm4qViqbBx8a+sKa3u7m2sq6rqaSbiHhpXVJMlLbT5ery+fvy1bvF2OHg" +
  "39vUzcjGxMO/vsXMyLCbiHhqXVJJg7LCuLDN1NLMxL63samgkYBwcpKprKqgmKHE0tHIsK2tqqinxdLY2djVzbylkYBxY1dN" +
  "RDs0LikkHxwYY6rM6PXy6tS6pJB/cGJXTEN7uczMy+f09tm/qJSCe73Oxbevu7+znp7Q6vXz7erj4N/e3NvUy8HAy83Kwrmy" +
  "qbq5r6fK2NfSwL3H0dDOyMbFyMjPx6+amJaSjoygpKOVhHx5oLG4ubevoo59eoiwzuPv7+bV1Nzc29nVwq+op6WloZ2ampiK" +
  "eWuNqKqmoZePh4F7b2JcaZSPfnGr2ODZzsfGzdvcx6+qqqepqaahnKGstLOzsKqglIuGhYN/e3lzeoiKhoOCc2VZfZKQjIiC" +
  "enFmXFFJQDgxLCYiHhoXFBIQSaXW7eXf1tPQ0M7Hxc69qsbEw9POtcPNy8nEt7OpucfFrbKsopasw8fBsaq2vL7Ey9DPtqCP" +
  "udLd29nZ2dbSzce/tKSjoKGem5eppJ+ep661uMvb4eLg29PMwsTP1dPMxLWko6SimIuLiIF3gYZ2a4yLiIWQoaSjtMDIxb2x" +
  "sLCcjHtslKi0tKSRf4OCf3t4ipqqrq2rppyTjo2PjHtsaW50dHNuYVVLQjozLSgjHxsYFRIQXLbe8Ovk1r2mk62+tLTR0MbA" +
  "vLeyrba5trKxt7WupaOpp5OCnbvBwL25raWknJeNmqaik5OflImLhYN0ZnZ7bWBgcnJsYVZLQjozLSgjHxsYFRIQDg0LCgkI" +
  "B1KKqqKbz+Tj3NjX1sy+utnk6unl2MrEwcC9urvEzcu7pZqYl5aUkIuChouHhYJ+gY6Oi4R4bmNXTEM7NC4oJB8cGBVJkbi4" +
  "ztvWz7+/4vLs4dLZ2dbR4uPj3NbUwKquw8C8uL7Z6/b17d7LtZ+Me21gVEpBOTIsJyIeGxcVEluMn7XS1tLO6fXy1dHDvMi0" +
  "r8S/tbDB0dLNxcG+t7SxrKakoZuIeI2amZSRk5iXjYaCm6+2uLi4t7a1q6GnpZGCipOQh4Z+b2J7kYqYqKefmpedm6ivq5eF" +
  "sc3NzMzJwrivq6mbiIGSmIp5goN/mquqnImGtLu1qZqId2ldUUg/NzErJiE7XZOIeJ/U7OjRuLzh6eTf2dvv+Pz+/v322eTw" +
  "7+fZ4eXe1sevss3a2suznbDL2NHLx8PL0tbW1M7Ky8jBv7uxqZmarcPR0czFwLevq6ijnJaVrLvDw8fGv6iUkZKCend2aGd/" +
  "fImFnaWjnZaQjI6Oj49+bmFXfpeampiUjYd5cGpdUkhAODErJiIeJmyytr3h6/Lx5+Hgz8Dh49G4os3n5MmxnIl5al1SSGGL" +
  "p77CvKWSk7Szx9fY08q9r6CPfm9iVkxCOjNKVWh5lqeem7bBwcDN0dbTzsjAs52LemtogqWyqZyczOju6+jm7fL39/Tv6d/P" +
  "w9nm5eDWzcO0oKimloSsure1tKaSpcPDvrOmmIx/enZ1dXaCkJmZlpWjsrmqlqSvrqmUg5S5wbqyrKWgn5uZm62uqquppJOC" +
  "cmRYTkQ8NS8pJCAcW7Xe8OfYvrKvw8Wto8HPzMfDyc7MyL2xp6qppaWsp5+XjouOfW5kkqqvr6qlnIt6bGViXnZ9fHt9j5aX" +
  "j42IfG5gVUtCOjMtJyMeGxgVEma64Ozmy7KsttnZ0+v29/b5/P379evi2tHMyMSsqsbMxr+qpbKzraacvd3w+O/pzb28ta6i" +
  "l6qopaCblI+GfHp8i5GVmJ2cucnJxb+6t7Wyq6SbiJOIhIues8LFxLy2ub24s6WZxcPAs6vByMKzsa+qoZiGhp6fmJGLiIR8" +
  "cGNXTEM7NC4oIx8bGBUTEYHG5uTX7Pbx8Pj6+PPy7+ni4+rp49PO1dXTz8nFw8Kupbe2rqejn4x7bI3A2+Tl49nNu7uuoqCg" +
  "pauno56bj35wcKe5oo+Hh4WDg4uMioaCjKOtqpWDhHxthoyHd3eAe3p0eIKCf3puYldMQzs0";

const bytes =
  typeof atob === "function"
    ? Uint8Array.from(atob(PACKED), (ch) => ch.charCodeAt(0))
    : Uint8Array.from(Buffer.from(PACKED, "base64"));

/** Loudness 0–1 at a GLOBAL frame. Outside the track it reads 0. */
export const voLevel = (globalFrame: number) => {
  const i = Math.round(globalFrame);
  return i >= 0 && i < bytes.length ? bytes[i] / 255 : 0;
};

export const VO_FRAMES = bytes.length;
